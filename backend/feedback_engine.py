"""
feedback_engine.py — Gemini-powered rubric-anchored essay scoring and margin annotation.

The single public entry-point for accuracy_eval.py and app.py is:
    generate_feedback_from_raw(essay_text, rubric, ...)

It returns a dict whose "criterion_scores" key contains per-criterion
{score, confidence, comment} entries that accuracy_eval.py reads for QWK
computation.
"""

import json
import os
import re
import sys
import time
from typing import Optional

from rubric_engine import compute_weighted_score, score_to_letter_grade, serialise_rubric_for_prompt


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------

class FeedbackEngineError(RuntimeError):
    """
    Raised on unrecoverable Gemini API or response-parsing failures after all
    retry attempts are exhausted.
    """


# ---------------------------------------------------------------------------
# Module-level Gemini client cache
# Avoid re-initialising the client on every call within the same process.
# ---------------------------------------------------------------------------

_client_cache: dict = {}   # key: (model_name,) → GenerativeModel instance


def _get_client(model_name: str, api_key: str):
    """
    Return a cached Gemini GenerativeModel. On first call for a given
    model_name, initialise the google.generativeai library with *api_key*.

    Raises:
        FeedbackEngineError: If google-generativeai is not installed.
        FeedbackEngineError: If api_key is empty or None.
    """
    cache_key = model_name

    if cache_key in _client_cache:
        return _client_cache[cache_key]

    if not api_key:
        raise FeedbackEngineError(
            "GEMINI_API_KEY is not set. "
            "Copy .env.example to .env and add your key from "
            "https://aistudio.google.com/app/apikey"
        )

    try:
        import google.generativeai as genai
    except ImportError as exc:
        raise FeedbackEngineError(
            "google-generativeai is not installed. "
            "Run: pip install google-generativeai"
        ) from exc

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name=model_name,
        # Instruct the model at the system level to act as an essay grader.
        # This persists across all generate_content() calls on this instance.
        system_instruction=(
            "You are an expert essay grader with 20 years of secondary and "
            "post-secondary teaching experience. You grade essays fairly, "
            "consistently, and with constructive specificity. "
            "You ALWAYS respond with valid JSON exactly matching the schema "
            "provided — no markdown fences, no extra commentary, no keys "
            "other than those specified."
        ),
    )

    _client_cache[cache_key] = model
    return model


def _load_api_key() -> str:
    """
    Load the Gemini API key from the GEMINI_API_KEY environment variable.
    Automatically reads .env if python-dotenv is installed.
    Returns an empty string if not set (callers must check and raise).
    """
    try:
        from dotenv import load_dotenv
        load_dotenv(
            dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"),
            override=False,
        )
    except ImportError:
        pass  # python-dotenv not installed; rely on environment only

    return os.environ.get("GEMINI_API_KEY", "")


# ---------------------------------------------------------------------------
# Prompt construction
# ---------------------------------------------------------------------------

_OUTPUT_SCHEMA = """\
{
  "criterion_scores": {
    "<criterion_id>": {
      "score": <integer within the criterion's scale_min..scale_max>,
      "confidence": <float 0.0–1.0; 1.0 = very confident, 0.5 = borderline>,
      "comment": "<1–2 sentence justification referencing the anchor examples>"
    }
    // ... one entry per criterion
  },
  "strengths": [
    "<strength 1 — specific, tied to the text>",
    "<strength 2>",
    "<strength 3>"
  ],
  "improvements": [
    "<concrete revision suggestion 1>",
    "<concrete revision suggestion 2>",
    "<concrete revision suggestion 3>"
  ],
  "margin_notes": [
    {
      "type": "correction",
      "tag": "<short label e.g. Comma Splice>",
      "excerpt": "<verbatim quote from the essay, ≤80 chars>",
      "note": "<annotation text>",
      "suggestion": "<corrected version for type=correction; null otherwise>"
    }
    // 2–5 margin notes total; mix correction, praise, insight types
  ],
  "pedagogical_insight": "<1–2 paragraph deeper observation beyond the rubric>"
}"""


def build_scoring_prompt(
    essay_text: str,
    rubric: dict,
    essay_metadata: Optional[dict] = None,
) -> str:
    """
    Construct the full rubric-anchored Chain-of-Thought scoring prompt.

    Sections:
        1. Rubric (serialised with anchors verbatim)
        2. Essay metadata (word count, paragraph count, avg sentence length)
        3. Essay body (clearly delimited)
        4. CoT scoring instructions
        5. Output schema (strict JSON, no markdown)

    Args:
        essay_text:      Cleaned essay text from preprocessing.normalize_text.
        rubric:          Loaded, validated rubric dict.
        essay_metadata:  Optional dict with keys word_count, paragraph_count,
                         avg_sentence_length (from preprocessing.segment_text).

    Returns:
        String prompt ready to pass to GenerativeModel.generate_content().
    """
    crit_ids = [c["id"] for c in rubric["criteria"]]

    # Build metadata block
    if essay_metadata:
        meta_lines = [
            f"  Word count:             {essay_metadata.get('word_count', 'unknown')}",
            f"  Paragraph count:        {essay_metadata.get('paragraph_count', 'unknown')}",
            f"  Avg sentence length:    {essay_metadata.get('avg_sentence_length', 'unknown')} words",
        ]
        meta_block = "\n".join(meta_lines)
    else:
        words = len(essay_text.split())
        meta_block = f"  Word count: {words} (approximate)"

    # Build criterion ID list for explicit output contract
    crit_id_list = "  " + "\n  ".join(f'"{cid}"' for cid in crit_ids)

    prompt = f"""\
{serialise_rubric_for_prompt(rubric)}
=== ESSAY METADATA ===
{meta_block}

=== ESSAY TEXT ===
---BEGIN ESSAY---
{essay_text}
---END ESSAY---

=== GRADING INSTRUCTIONS ===
Step 1 — For EACH criterion in the rubric:
  a. Read the anchor examples carefully. They define the low/mid/high score bands.
  b. Locate specific evidence in the essay that supports your score.
  c. Choose an integer score strictly within the criterion's [scale_min, scale_max] range.
  d. Set confidence to 1.0 if you are certain; 0.7 if reasonable; 0.5 if the essay
     sits squarely between two scores.

Step 2 — Identify 2–3 specific strengths and 2–3 concrete improvement areas.

Step 3 — Select 3–5 short verbatim excerpts from the essay for margin notes.
  Use type "correction" for grammar/mechanics errors (include a "suggestion" field).
  Use type "praise" for exemplary phrases.
  Use type "insight" for structural or analytical observations.

Step 4 — Write a 1–2 paragraph pedagogical insight that goes BEYOND the rubric:
  what distinguishes this student's voice, what their next developmental step is,
  and any craft-level observations a skilled teacher would make.

=== OUTPUT CONTRACT ===
Respond with ONLY valid JSON. No markdown fences. No keys outside this schema.
The "criterion_scores" object MUST contain exactly these criterion IDs:
{crit_id_list}

Schema:
{_OUTPUT_SCHEMA}
"""
    return prompt


# ---------------------------------------------------------------------------
# Response parsing
# ---------------------------------------------------------------------------

def _extract_json(raw_text: str) -> str:
    """
    Extract a JSON object from *raw_text*, handling cases where the model
    wraps output in markdown code fences despite being instructed not to.

    Priority:
        1. Strip ```json ... ``` or ``` ... ``` fences.
        2. Find the outermost { ... } block if no fences found.
    """
    # Strip markdown fences
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw_text)
    if fence_match:
        return fence_match.group(1).strip()

    # Find outermost JSON object
    start = raw_text.find("{")
    end = raw_text.rfind("}")
    if start != -1 and end > start:
        return raw_text[start:end + 1]

    return raw_text.strip()


def _parse_response(raw_text: str, rubric: dict) -> dict:
    """
    Parse and validate the model's JSON response.

    Validates:
        - All criterion IDs from the rubric are present in "criterion_scores".
        - Each criterion score is within [scale_min, scale_max] (clamped with warning).
        - Each confidence value is in [0.0, 1.0] (clamped).
        - Required top-level keys: criterion_scores, strengths, improvements,
          margin_notes, pedagogical_insight.

    Returns:
        Validated and lightly sanitised response dict.

    Raises:
        FeedbackEngineError: If the JSON is unparseable or missing critical fields.
    """
    json_text = _extract_json(raw_text)

    try:
        data = json.loads(json_text)
    except json.JSONDecodeError as exc:
        raise FeedbackEngineError(
            f"Model response is not valid JSON. Parsing error: {exc}\n"
            f"Raw response (first 500 chars):\n{raw_text[:500]}"
        ) from exc

    # Validate top-level required keys
    required = {"criterion_scores", "strengths", "improvements", "margin_notes", "pedagogical_insight"}
    missing = required - set(data.keys())
    if missing:
        raise FeedbackEngineError(
            f"Model response is missing required keys: {missing!r}\n"
            f"Keys present: {list(data.keys())}"
        )

    # Validate and sanitise criterion scores
    crit_lookup = {c["id"]: c for c in rubric["criteria"]}
    missing_crits = set(crit_lookup.keys()) - set(data["criterion_scores"].keys())
    if missing_crits:
        raise FeedbackEngineError(
            f"Model response is missing criterion scores for: {missing_crits!r}"
        )

    for cid, crit in crit_lookup.items():
        entry = data["criterion_scores"].get(cid, {})
        smin = float(crit["scale_min"])
        smax = float(crit["scale_max"])

        # Score: must be numeric, clamp to valid range
        raw_score = entry.get("score")
        if not isinstance(raw_score, (int, float)):
            raise FeedbackEngineError(
                f"criterion_scores[{cid!r}]['score'] must be numeric; got {raw_score!r}"
            )
        score = float(raw_score)
        if not (smin <= score <= smax):
            sys.stderr.write(
                f"[feedback_engine] WARNING: score {score} for {cid!r} is outside "
                f"[{smin}, {smax}]; clamping.\n"
            )
            score = max(smin, min(smax, score))
        data["criterion_scores"][cid]["score"] = score

        # Confidence: must be 0.0–1.0, clamp
        raw_conf = entry.get("confidence", 0.8)
        if not isinstance(raw_conf, (int, float)):
            raw_conf = 0.8
        data["criterion_scores"][cid]["confidence"] = max(0.0, min(1.0, float(raw_conf)))

        # Comment: ensure it is a string
        if not isinstance(entry.get("comment", ""), str):
            data["criterion_scores"][cid]["comment"] = str(entry.get("comment", ""))

    # Ensure lists are lists
    for list_key in ("strengths", "improvements", "margin_notes"):
        if not isinstance(data[list_key], list):
            data[list_key] = []

    # Ensure pedagogical_insight is a string
    if not isinstance(data.get("pedagogical_insight"), str):
        data["pedagogical_insight"] = str(data.get("pedagogical_insight", ""))

    return data


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_feedback_from_raw(
    essay_text: str,
    rubric: dict,
    essay_id: str = "unknown",
    model_name: str = "gemini-2.5-flash",
    temperature: float = 0.2,
    max_retries: int = 2,
    retry_delay: float = 3.0,
) -> dict:
    """
    Generate rubric-anchored AI feedback for a single essay using Gemini.

    This is the primary entry-point for both accuracy_eval.py (batch mode)
    and app.py (interactive mode).

    Args:
        essay_text:    Raw or pre-cleaned essay text.
        rubric:        Validated rubric dict from rubric_engine.load_rubric().
        essay_id:      Identifier used in logging and returned in the result.
        model_name:    Gemini model to use. Default: gemini-2.5-flash.
        temperature:   Sampling temperature. Low values (0.1–0.3) recommended
                       for reproducible scoring.
        max_retries:   Number of additional attempts on JSON parse failure.
        retry_delay:   Seconds to wait between retry attempts.

    Returns:
        A dict with the following structure::

            {
              "essay_id":       str,
              "criterion_scores": {
                  "<criterion_id>": {
                      "score":      float,   # within rubric scale
                      "confidence": float,   # 0.0–1.0
                      "comment":    str,
                  }, ...
              },
              "overall_score":  float,       # weighted composite 0–100
              "letter_grade":   str,
              "status_label":   str,
              "strengths":      list[str],
              "improvements":   list[str],
              "margin_notes":   list[dict],
              "pedagogical_insight": str,
              "raw_model_response": str,
            }

    Raises:
        FeedbackEngineError: If all retry attempts fail or if the Gemini API
                             key is missing / the SDK is not installed.
    """
    api_key = _load_api_key()
    model = _get_client(model_name, api_key)

    # Build the prompt (apply light preprocessing for metadata — import lazily
    # to avoid a circular dependency if preprocessing imports feedback_engine)
    try:
        from preprocessing import normalize_text, segment_text
        cleaned = normalize_text(essay_text)
        seg = segment_text(cleaned)
        essay_metadata = seg["stats"]
        prompt_text = build_scoring_prompt(cleaned, rubric, essay_metadata)
    except Exception:
        # Fallback: use raw text without metadata
        cleaned = essay_text
        prompt_text = build_scoring_prompt(cleaned, rubric)

    # Build Gemini GenerationConfig with temperature
    try:
        import google.generativeai as genai
        gen_config = genai.types.GenerationConfig(
            temperature=temperature,
            response_mime_type="application/json",
        )
    except Exception:
        gen_config = None  # Some SDK versions don't support all params

    last_error = None
    raw_text = ""

    for attempt in range(max_retries + 1):
        try:
            if gen_config is not None:
                response = model.generate_content(prompt_text, generation_config=gen_config)
            else:
                response = model.generate_content(prompt_text)

            raw_text = response.text
            parsed = _parse_response(raw_text, rubric)
            break  # Success — exit retry loop

        except FeedbackEngineError as parse_err:
            last_error = parse_err
            if attempt < max_retries:
                sys.stderr.write(
                    f"[feedback_engine] WARNING: Attempt {attempt + 1} failed for "
                    f"essay {essay_id!r}: {parse_err}. Retrying in {retry_delay}s...\n"
                )
                time.sleep(retry_delay)
            else:
                raise FeedbackEngineError(
                    f"All {max_retries + 1} attempts failed for essay {essay_id!r}. "
                    f"Last error: {last_error}"
                ) from last_error

        except Exception as api_err:
            last_error = api_err
            if attempt < max_retries:
                sys.stderr.write(
                    f"[feedback_engine] WARNING: Gemini API error (attempt {attempt + 1}) "
                    f"for essay {essay_id!r}: {api_err}. Retrying in {retry_delay}s...\n"
                )
                time.sleep(retry_delay)
            else:
                raise FeedbackEngineError(
                    f"Gemini API call failed for essay {essay_id!r} after "
                    f"{max_retries + 1} attempts: {last_error}"
                ) from last_error

    # Compute composite score and letter grade
    score_entries = [
        {"criterion_id": cid, "score": v["score"]}
        for cid, v in parsed["criterion_scores"].items()
    ]
    overall_score = compute_weighted_score(score_entries, rubric)
    letter_grade, status_label = score_to_letter_grade(overall_score)

    return {
        "essay_id":          essay_id,
        "criterion_scores":  parsed["criterion_scores"],
        "overall_score":     overall_score,
        "letter_grade":      letter_grade,
        "status_label":      status_label,
        "strengths":         parsed.get("strengths", []),
        "improvements":      parsed.get("improvements", []),
        "margin_notes":      parsed.get("margin_notes", []),
        "pedagogical_insight": parsed.get("pedagogical_insight", ""),
        "raw_model_response": raw_text,
    }