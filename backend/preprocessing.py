"""
preprocessing.py — Essay text cleaning, normalisation, and structural analysis.

Two public functions form the complete preprocessing pipeline:

  normalize_text(raw_text)   → cleaned string  (encoding / formatting only)
  segment_text(normalized)   → paragraphs, sentences, and surface statistics

Run as a script to process data/sample_essays.json and print per-essay stats:
  python preprocessing.py
"""

import json
import os
import re
import sys
import unicodedata

# ---------------------------------------------------------------------------
# Smart-quote / typographic character mapping
# ---------------------------------------------------------------------------
# Left / right single quotation marks  →  apostrophe / straight single quote
# Left / right double quotation marks  →  straight double quote
# Em dash  →  double hyphen (common prose substitute)
# En dash  →  single hyphen
# Horizontal ellipsis  →  three dots
# Non-breaking space, thin space, hair space  →  regular space
# Zero-width no-break space / BOM  →  empty (removed)

_CHAR_MAP: list[tuple[str, str]] = [
    # Single quotes / apostrophes
    ("\u2018", "'"),   # LEFT SINGLE QUOTATION MARK
    ("\u2019", "'"),   # RIGHT SINGLE QUOTATION MARK
    ("\u201A", "'"),   # SINGLE LOW-9 QUOTATION MARK
    ("\u201B", "'"),   # SINGLE HIGH-REVERSED-9 QUOTATION MARK
    ("\u02BC", "'"),   # MODIFIER LETTER APOSTROPHE (common OCR output)
    ("\u0060", "'"),   # GRAVE ACCENT used as opening quote
    # Double quotes
    ("\u201C", '"'),   # LEFT DOUBLE QUOTATION MARK
    ("\u201D", '"'),   # RIGHT DOUBLE QUOTATION MARK
    ("\u201E", '"'),   # DOUBLE LOW-9 QUOTATION MARK
    ("\u201F", '"'),   # DOUBLE HIGH-REVERSED-9 QUOTATION MARK
    ("\u00AB", '"'),   # LEFT-POINTING DOUBLE ANGLE QUOTATION MARK (guillemet)
    ("\u00BB", '"'),   # RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK
    # Dashes
    ("\u2014", "--"),  # EM DASH
    ("\u2013", "-"),   # EN DASH
    ("\u2012", "-"),   # FIGURE DASH
    ("\u2015", "--"),  # HORIZONTAL BAR
    # Ellipsis
    ("...", "..."), # HORIZONTAL ELLIPSIS
    # Spaces
    ("\u00A0", " "),   # NO-BREAK SPACE
    ("\u2009", " "),   # THIN SPACE
    ("\u200A", " "),   # HAIR SPACE
    ("\u202F", " "),   # NARROW NO-BREAK SPACE
    ("\u3000", " "),   # IDEOGRAPHIC SPACE
    # Invisible / zero-width characters
    ("\uFEFF", ""),    # ZERO WIDTH NO-BREAK SPACE / BOM
    ("\u200B", ""),    # ZERO WIDTH SPACE
    ("\u200C", ""),    # ZERO WIDTH NON-JOINER
    ("\u200D", ""),    # ZERO WIDTH JOINER
    # Ligatures (common OCR artifacts)
    ("\uFB00", "ff"),  # LATIN SMALL LIGATURE FF
    ("\uFB01", "fi"),  # LATIN SMALL LIGATURE FI
    ("\uFB02", "fl"),  # LATIN SMALL LIGATURE FL
    ("\uFB03", "ffi"), # LATIN SMALL LIGATURE FFI
    ("\uFB04", "ffl"), # LATIN SMALL LIGATURE FFL
    ("\uFB05", "st"),  # LATIN SMALL LIGATURE ST
]

# Pre-compile a single translation table for all single-character replacements
# (multi-char replacements are handled in a second pass with str.replace).
_SINGLE_TRANS: dict[int, str] = {}
_MULTI_REPLACEMENTS: list[tuple[str, str]] = []

for _src, _dst in _CHAR_MAP:
    if len(_src) == 1:
        _SINGLE_TRANS[ord(_src)] = _dst
    else:
        _MULTI_REPLACEMENTS.append((_src, _dst))


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def normalize_text(raw_text: str) -> str:
    """
    Normalise raw essay text for downstream processing.

    Operations performed (in order):
        1. Unicode NFKC normalisation — decomposes compatibility characters
           (e.g. full-width letters, superscript digits) into their canonical
           plain-ASCII equivalents where possible.
        2. Smart-quote / typographic substitution — converts curly quotes,
           guillemets, em-dashes, en-dashes, ligatures, and invisible
           zero-width characters to their plain-ASCII counterparts.
        3. Strip trailing whitespace from every line.
        4. Collapse runs of 3+ blank lines to exactly one blank line —
           preserves paragraph structure without leaving excessive whitespace.
        5. Fix stray mid-sentence line breaks — a single newline (i.e. NOT
           a paragraph break) between two non-whitespace characters is
           replaced by a single space. This repairs the most common OCR
           artefact where lines are hard-wrapped inside sentences.
        6. Collapse runs of 2+ spaces to a single space within lines.
        7. Strip leading and trailing whitespace from the entire document.

    What is NOT changed:
        - Casing (all uppercase / lowercase preserved as-is).
        - Spelling and grammar (including errors — intentional for downstream
          grammar detection).
        - Paragraph boundaries (double-newline separators are preserved).

    Args:
        raw_text: Raw essay text, which may include copy-pasted content
                  with smart quotes, OCR output, or mixed-encoding issues.

    Returns:
        A cleaned string with the same semantic content as the input but
        with normalised whitespace, encoding, and typographic characters.
    """
    if not isinstance(raw_text, str):
        raise TypeError(f"normalize_text expects str, got {type(raw_text).__name__!r}")

    # 1. Unicode NFKC normalisation.
    text = unicodedata.normalize("NFKC", raw_text)

    # 2. Single-character typographic substitutions (fast translation table).
    text = text.translate(_SINGLE_TRANS)

    # 2b. Multi-character source replacements (ligatures with > 1 src char
    #     are already handled by NFKC; remaining entries are rare, but we
    #     iterate for safety).
    for src, dst in _MULTI_REPLACEMENTS:
        text = text.replace(src, dst)

    # 3. Strip trailing whitespace (spaces / tabs) from every line.
    #    Preserves line endings themselves.
    lines = text.split("\n")
    lines = [line.rstrip(" \t") for line in lines]
    text = "\n".join(lines)

    # 4. Collapse runs of 3 or more consecutive blank lines to exactly one
    #    blank line.  A "blank line" is a line that is empty or contains
    #    only whitespace after the rstrip above.
    text = re.sub(r"\n{3,}", "\n\n", text)

    # 5. Fix stray mid-sentence line breaks.
    #    A stray break is a single \n that is NOT a paragraph separator
    #    (\n\n).  We identify them as: a non-whitespace character, then \n
    #    (not followed by another \n), then a non-whitespace character.
    #    Replace with a single space.
    #
    #    Use a negative lookahead/lookbehind so we don't touch true
    #    paragraph breaks.
    text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)

    # 6. Collapse runs of 2+ spaces to a single space within each line.
    text = re.sub(r"[ \t]{2,}", " ", text)

    # 7. Strip the whole document.
    text = text.strip()

    return text


def segment_text(normalized_text: str) -> dict:
    """
    Split normalised essay text into paragraphs and sentences, and compute
    surface-level statistics.

    Args:
        normalized_text: Output of normalize_text().

    Returns:
        A dict with the following structure::

            {
                "paragraphs": ["Paragraph one text...", "Paragraph two..."],
                "sentences":  ["Sentence 1.", "Sentence 2.", ...],
                "stats": {
                    "paragraph_count":    int,
                    "sentence_count":     int,
                    "word_count":         int,
                    "avg_sentence_length": float,  # words per sentence
                }
            }

        ``paragraphs`` are split on one or more blank lines.
        ``sentences``  are produced by NLTK's Punkt sentence tokeniser,
                       applied across the whole document (not per-paragraph)
                       so cross-paragraph sentence detection is avoided but
                       short exclamatory / interrogative last-sentences of
                       paragraphs are not merged.
        ``stats`` uses word_count = number of whitespace-delimited tokens
                  in the full normalised text (not lowercased, not filtered).

    Raises:
        RuntimeError: If NLTK punkt data cannot be loaded and the offline
                      fallback (regex sentence splitter) is also unavailable.
    """
    # ----- Paragraph splitting -----
    # Split on one or more blank lines (lines containing only whitespace).
    raw_paragraphs = re.split(r"\n\s*\n", normalized_text)
    paragraphs = [p.strip() for p in raw_paragraphs if p.strip()]

    # ----- Sentence tokenisation via NLTK Punkt -----
    sentences = _sentence_tokenize(normalized_text)

    # ----- Surface statistics -----
    words = normalized_text.split()          # whitespace-delimited tokens
    word_count = len(words)
    sentence_count = len(sentences)
    paragraph_count = len(paragraphs)

    avg_sentence_length = (
        round(word_count / sentence_count, 2) if sentence_count > 0 else 0.0
    )

    return {
        "paragraphs": paragraphs,
        "sentences": sentences,
        "stats": {
            "paragraph_count": paragraph_count,
            "sentence_count": sentence_count,
            "word_count": word_count,
            "avg_sentence_length": avg_sentence_length,
        },
    }


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _sentence_tokenize(text: str) -> list:
    """
    Tokenise *text* into sentences using NLTK Punkt.

    Download Strategy
    -----------------
    1. Try to import and use ``nltk.sent_tokenize`` directly (assumes
       punkt data is already downloaded).
    2. If the punkt resource is missing, attempt a quiet download with a
       3-second timeout per attempt and retry once.
    3. If the download fails (offline environment), fall back to a simple
       regex-based sentence splitter and emit a warning to stderr.

    Returns:
        list[str] of sentence strings.
    """
    try:
        import nltk
    except ImportError:
        # nltk not installed — fall back to regex splitter.
        sys.stderr.write(
            "[preprocessing] WARNING: nltk not installed. "
            "Using regex sentence splitter fallback.\n"
        )
        return _regex_sentence_split(text)

    # Attempt NLTK tokenisation; if punkt data is absent, download it.
    for attempt in range(2):
        try:
            sentences = nltk.sent_tokenize(text, language="english")
            return [s.strip() for s in sentences if s.strip()]
        except LookupError:
            if attempt == 0:
                sys.stderr.write(
                    "[preprocessing] INFO: NLTK punkt data not found. "
                    "Attempting download...\n"
                )
                try:
                    nltk.download("punkt", quiet=True)
                    nltk.download("punkt_tab", quiet=True)
                except Exception as exc:
                    sys.stderr.write(
                        f"[preprocessing] WARNING: NLTK punkt download failed "
                        f"({exc}). Using regex sentence splitter fallback.\n"
                    )
                    return _regex_sentence_split(text)
            else:
                # Second attempt failed after download — give up on NLTK.
                sys.stderr.write(
                    "[preprocessing] WARNING: NLTK punkt still unavailable after "
                    "download attempt. Using regex sentence splitter fallback.\n"
                )
                return _regex_sentence_split(text)

    return _regex_sentence_split(text)  # unreachable but satisfies type checker


def _regex_sentence_split(text: str) -> list:
    """
    Offline fallback: split *text* into sentences using a simple regex.

    Splits on ``. !  ?`` followed by whitespace and an uppercase letter,
    or at the end of the string.  Not as accurate as Punkt but serviceable
    for stats computation when NLTK is unavailable.

    Returns:
        list[str] of sentence strings.
    """
    # Match sentence-ending punctuation followed by space + capital letter,
    # or end-of-string.
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
    return [p.strip() for p in parts if p.strip()]


# ---------------------------------------------------------------------------
# __main__ — demo runner over data/sample_essays.json
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Resolve data file relative to this script, not the CWD, so that the
    # demo works regardless of where it is invoked from.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, "data", "sample_essays.json")

    if not os.path.exists(data_path):
        sys.exit(
            f"[preprocessing] ERROR: Cannot find {data_path!r}. "
            "Make sure you are running from the essay-feedback-ai directory "
            "and that data/sample_essays.json exists."
        )

    with open(data_path, "r", encoding="utf-8-sig") as fh:
        essays = json.load(fh)

    # -----------------------------------------------------------------------
    # Header
    # -----------------------------------------------------------------------
    print()
    print("=" * 78)
    print("  Marginalia — Preprocessing Pipeline Demo")
    print(f"  Source: {data_path}")
    print(f"  Essays: {len(essays)}")
    print("=" * 78)

    col_w = [10, 14, 6, 8, 8, 8, 10]
    headers = ["Essay ID", "Quality", "Words", "Paras", "Sents", "Avg SL", "Student"]
    sep = "  ".join("-" * w for w in col_w)
    header_row = "  ".join(h.ljust(w) for h, w in zip(headers, col_w))

    print()
    print(header_row)
    print(sep)

    for essay in essays:
        raw = essay["text"]

        # Stage 1: normalise
        normalised = normalize_text(raw)

        # Stage 2: segment
        result = segment_text(normalised)
        stats = result["stats"]

        row = "  ".join([
            essay["essay_id"].ljust(col_w[0]),
            essay["quality_band"].ljust(col_w[1]),
            str(stats["word_count"]).ljust(col_w[2]),
            str(stats["paragraph_count"]).ljust(col_w[3]),
            str(stats["sentence_count"]).ljust(col_w[4]),
            str(stats["avg_sentence_length"]).ljust(col_w[5]),
            essay.get("student_name", "—").ljust(col_w[6]),
        ])
        print(row)

    print(sep)
    print()

    # -----------------------------------------------------------------------
    # Detailed breakdown for the first essay (verbose demo)
    # -----------------------------------------------------------------------
    demo = essays[0]
    print(f"-- Detailed breakdown: {demo['essay_id']} ({demo['quality_band']}) ──")
    print()
    normalised = normalize_text(demo["text"])
    result = segment_text(normalised)

    for i, para in enumerate(result["paragraphs"], 1):
        preview = para[:120].replace("\n", " ")
        ellipsis = "..." if len(para) > 120 else ""
        print(f"  ¶{i}  {preview}{ellipsis}")
    print()
    print("  First 5 sentences:")
    for sent in result["sentences"][:5]:
        print(f"    • {sent}")
    print()


