"""
test_preprocessing.py — Unit tests for preprocessing.py.

Covers:
  - Smart-quote and typographic character conversion
  - Trailing whitespace stripping per line
  - Blank-line collapsing (2+ blanks → 1 blank)
  - OCR stray mid-sentence line-break repair
  - Double-space collapsing
  - Ligature expansion
  - Zero-width character removal
  - Unicode NFKC normalisation of compatibility characters
  - Paragraph splitting (correct count and content)
  - Sentence counting on known text
  - Average sentence length calculation
  - Empty / whitespace-only input edge cases
  - segment_text stats consistency

Run with:
    python -m pytest test_preprocessing.py -v
  or:
    python test_preprocessing.py
"""

import sys
import os
import unittest

# Allow running from repo root without installing as a package.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from preprocessing import normalize_text, segment_text


# ---------------------------------------------------------------------------
# normalize_text tests
# ---------------------------------------------------------------------------

class TestSmartQuoteConversion(unittest.TestCase):
    """Smart quotes and typographic apostrophes → plain ASCII."""

    def test_left_double_quote(self):
        self.assertEqual(normalize_text("\u201CHello\u201D"), '"Hello"')

    def test_right_single_quote_apostrophe(self):
        self.assertEqual(normalize_text("don\u2019t"), "don't")

    def test_left_single_quote(self):
        self.assertEqual(normalize_text("\u2018word\u2019"), "'word'")

    def test_guillemets(self):
        result = normalize_text("\u00ABquoted\u00BB")
        self.assertEqual(result, '"quoted"')

    def test_low9_double_quote(self):
        # LOW-9 quotation mark → plain double quote
        result = normalize_text("\u201Etext\u201C")
        self.assertEqual(result, '"text"')

    def test_mixed_quotes_in_sentence(self):
        raw = "\u201CHe said, \u2018hello.\u2019\u201D"
        result = normalize_text(raw)
        self.assertEqual(result, '"He said, \'hello.\'"')

    def test_grave_accent_quote(self):
        result = normalize_text("`quoted`")
        self.assertEqual(result, "'quoted'")

    def test_modifier_apostrophe(self):
        # MODIFIER LETTER APOSTROPHE — common in OCR output
        result = normalize_text("can\u02BCt")
        self.assertEqual(result, "can't")


class TestDashConversion(unittest.TestCase):
    """Em-dash and en-dash → ASCII equivalents."""

    def test_em_dash_to_double_hyphen(self):
        result = normalize_text("word\u2014word")
        self.assertEqual(result, "word--word")

    def test_en_dash_to_hyphen(self):
        result = normalize_text("pages 10\u201315")
        self.assertEqual(result, "pages 10-15")

    def test_horizontal_bar(self):
        result = normalize_text("intro\u2015remark")
        self.assertEqual(result, "intro--remark")

    def test_ellipsis_to_three_dots(self):
        result = normalize_text("wait\u2026 then")
        self.assertEqual(result, "wait... then")


class TestWhitespaceCollapsing(unittest.TestCase):
    """Trailing whitespace stripping and blank-line collapsing."""

    def test_trailing_spaces_stripped_per_line(self):
        raw = "line one   \nline two  \nline three\t"
        result = normalize_text(raw)
        for line in result.split("\n"):
            self.assertFalse(line.endswith(" "), f"Trailing space in: {line!r}")
            self.assertFalse(line.endswith("\t"), f"Trailing tab in: {line!r}")

    def test_two_blank_lines_collapsed_to_one(self):
        raw = "para one\n\n\npara two"
        result = normalize_text(raw)
        self.assertIn("\n\n", result)
        self.assertNotIn("\n\n\n", result)

    def test_five_blank_lines_collapsed_to_one(self):
        raw = "para one\n\n\n\n\n\npara two"
        result = normalize_text(raw)
        self.assertNotIn("\n\n\n", result)
        # The two paragraphs should still be separated
        self.assertIn("\n\n", result)

    def test_exactly_two_newlines_preserved(self):
        raw = "para one\n\npara two"
        result = normalize_text(raw)
        self.assertIn("\n\n", result)
        self.assertNotIn("\n\n\n", result)

    def test_double_spaces_collapsed(self):
        raw = "This  is  a  test  sentence."
        result = normalize_text(raw)
        self.assertNotIn("  ", result)
        self.assertEqual(result, "This is a test sentence.")

    def test_tabs_between_words_collapsed(self):
        raw = "word1\t\tword2"
        result = normalize_text(raw)
        self.assertNotIn("\t\t", result)

    def test_leading_trailing_document_whitespace_stripped(self):
        raw = "\n\n  Hello world.  \n\n"
        result = normalize_text(raw)
        self.assertEqual(result[0], "H")
        self.assertEqual(result[-1], ".")


class TestOCRArtifactRepair(unittest.TestCase):
    """Stray mid-sentence line breaks (single newlines) replaced by space."""

    def test_single_newline_in_sentence_becomes_space(self):
        raw = "The student wrote a long\nessay about climate change."
        result = normalize_text(raw)
        self.assertEqual(result, "The student wrote a long essay about climate change.")

    def test_paragraph_break_preserved(self):
        raw = "First paragraph ends here.\n\nSecond paragraph starts here."
        result = normalize_text(raw)
        self.assertIn("\n\n", result)
        self.assertNotIn("\n\n\n", result)

    def test_multiple_stray_breaks_within_paragraph(self):
        raw = "This is line one\nthis is line two\nthis is line three."
        result = normalize_text(raw)
        self.assertNotIn("\n", result)
        self.assertEqual(result, "This is line one this is line two this is line three.")

    def test_paragraph_break_not_collapsed_to_space(self):
        raw = "End of paragraph one.\n\nStart of paragraph two."
        result = normalize_text(raw)
        parts = result.split("\n\n")
        self.assertEqual(len(parts), 2, "Paragraph break should be preserved as \\n\\n")


class TestLigatureExpansion(unittest.TestCase):
    """Common typographic ligatures (from OCR) expanded to ASCII."""

    def test_fi_ligature(self):
        result = normalize_text("\uFB01nal")   # ﬁnal → final
        self.assertEqual(result, "final")

    def test_fl_ligature(self):
        result = normalize_text("\uFB02oor")   # ﬂoor → floor
        self.assertEqual(result, "floor")

    def test_ff_ligature(self):
        result = normalize_text("\uFB00ect")   # ﬀect → ffect
        self.assertEqual(result, "ffect")

    def test_ffi_ligature(self):
        result = normalize_text("\uFB03cial")  # ﬃcial → ffficial
        self.assertEqual(result, "fficial")


class TestZeroWidthRemoval(unittest.TestCase):
    """Zero-width and BOM characters removed entirely."""

    def test_bom_removed(self):
        result = normalize_text("\uFEFFHello")
        self.assertEqual(result, "Hello")

    def test_zero_width_space_removed(self):
        result = normalize_text("hel\u200Blo")
        self.assertEqual(result, "hello")

    def test_zero_width_joiner_removed(self):
        result = normalize_text("word\u200Cword")
        self.assertEqual(result, "wordword")


class TestNFKCNormalisation(unittest.TestCase):
    """NFKC decomposes compatibility characters."""

    def test_fullwidth_letters_normalised(self):
        # Full-width ASCII chars (common in East Asian text copied into essays)
        result = normalize_text("\uFF48\uFF45\uFF4C\uFF4C\uFF4F")  # ｈｅｌｌｏ
        self.assertEqual(result, "hello")

    def test_superscript_digit_normalised(self):
        result = normalize_text("x\u00B2")   # x²  →  x2
        self.assertEqual(result, "x2")

    def test_no_casing_change(self):
        raw = "UPPERCASE lower MiXeD"
        result = normalize_text(raw)
        self.assertEqual(result, raw)

    def test_no_spelling_change(self):
        raw = "thier definately occured"   # deliberate misspellings
        result = normalize_text(raw)
        self.assertEqual(result, raw)

    def test_no_punctuation_change_beyond_mapping(self):
        raw = "Hello, world. How are you? Fine!"
        result = normalize_text(raw)
        self.assertEqual(result, raw)


class TestEdgeCases(unittest.TestCase):
    """Edge cases: empty input, whitespace-only, single word."""

    def test_empty_string(self):
        result = normalize_text("")
        self.assertEqual(result, "")

    def test_whitespace_only_string(self):
        result = normalize_text("   \n\n  \t  ")
        self.assertEqual(result, "")

    def test_single_word(self):
        result = normalize_text("  hello  ")
        self.assertEqual(result, "hello")

    def test_non_str_raises_type_error(self):
        with self.assertRaises(TypeError):
            normalize_text(42)

    def test_none_raises_type_error(self):
        with self.assertRaises(TypeError):
            normalize_text(None)


# ---------------------------------------------------------------------------
# segment_text tests
# ---------------------------------------------------------------------------

class TestParagraphSplitting(unittest.TestCase):
    """Paragraph count and content from segment_text."""

    def test_two_paragraphs_separated_by_blank_line(self):
        text = "First paragraph.\n\nSecond paragraph."
        result = segment_text(text)
        self.assertEqual(result["stats"]["paragraph_count"], 2)
        self.assertEqual(len(result["paragraphs"]), 2)

    def test_three_paragraphs(self):
        text = "One.\n\nTwo.\n\nThree."
        result = segment_text(text)
        self.assertEqual(result["stats"]["paragraph_count"], 3)

    def test_single_paragraph_no_blank_lines(self):
        text = "Just one paragraph with multiple sentences. No breaks."
        result = segment_text(text)
        self.assertEqual(result["stats"]["paragraph_count"], 1)

    def test_paragraph_content_preserved(self):
        text = "Alpha beta gamma.\n\nDelta epsilon zeta."
        result = segment_text(text)
        self.assertIn("Alpha beta gamma.", result["paragraphs"][0])
        self.assertIn("Delta epsilon zeta.", result["paragraphs"][1])

    def test_extra_blank_lines_do_not_create_empty_paragraphs(self):
        # normalize_text collapses 3+ newlines, so segment_text should
        # never produce empty paragraph strings.
        text = normalize_text("para one\n\n\n\n\npara two")
        result = segment_text(text)
        for para in result["paragraphs"]:
            self.assertTrue(para.strip(), "Empty paragraph found")

    def test_empty_text_returns_empty_paragraphs(self):
        result = segment_text("")
        self.assertEqual(result["paragraphs"], [])
        self.assertEqual(result["stats"]["paragraph_count"], 0)


class TestSentenceCounting(unittest.TestCase):
    """Sentence count on text with a known exact count."""

    def test_three_declarative_sentences(self):
        text = "The dog sat. The cat ran. The bird flew."
        result = segment_text(text)
        self.assertEqual(result["stats"]["sentence_count"], 3)

    def test_mixed_punctuation_sentences(self):
        text = "Is this a question? Yes, it is! Here is a statement."
        result = segment_text(text)
        self.assertEqual(result["stats"]["sentence_count"], 3)

    def test_sentences_list_length_matches_count(self):
        text = "First sentence. Second sentence. Third sentence."
        result = segment_text(text)
        self.assertEqual(
            len(result["sentences"]),
            result["stats"]["sentence_count"]
        )

    def test_single_sentence(self):
        text = "This essay argues that climate change is the defining issue of our era."
        result = segment_text(text)
        self.assertGreaterEqual(result["stats"]["sentence_count"], 1)

    def test_sentence_strings_are_non_empty(self):
        text = "Hello world. Goodbye world."
        result = segment_text(text)
        for sent in result["sentences"]:
            self.assertTrue(sent.strip(), f"Empty sentence found: {sent!r}")


class TestWordCount(unittest.TestCase):
    """Word count matches whitespace-split token count."""

    def test_exact_word_count(self):
        text = "one two three four five"
        result = segment_text(text)
        self.assertEqual(result["stats"]["word_count"], 5)

    def test_word_count_with_punctuation(self):
        # "Hello," is one token (whitespace-split)
        text = "Hello, world. How are you?"
        result = segment_text(text)
        self.assertEqual(result["stats"]["word_count"], 5)

    def test_empty_text_word_count_zero(self):
        result = segment_text("")
        self.assertEqual(result["stats"]["word_count"], 0)


class TestAvgSentenceLength(unittest.TestCase):
    """Average sentence length = word_count / sentence_count."""

    def test_avg_sentence_length_calculation(self):
        text = "One two three. Four five six seven."
        result = segment_text(text)
        stats = result["stats"]
        expected = round(stats["word_count"] / stats["sentence_count"], 2)
        self.assertAlmostEqual(stats["avg_sentence_length"], expected, places=2)

    def test_avg_sentence_length_zero_for_empty(self):
        result = segment_text("")
        self.assertEqual(result["stats"]["avg_sentence_length"], 0.0)

    def test_avg_sentence_length_is_float(self):
        text = "This is a test sentence. Another one here."
        result = segment_text(text)
        self.assertIsInstance(result["stats"]["avg_sentence_length"], float)


class TestReturnStructure(unittest.TestCase):
    """segment_text always returns the required keys."""

    def test_top_level_keys_present(self):
        result = segment_text("Some text.")
        self.assertIn("paragraphs", result)
        self.assertIn("sentences", result)
        self.assertIn("stats", result)

    def test_stats_keys_present(self):
        result = segment_text("Some text.")
        stats = result["stats"]
        for key in ("paragraph_count", "sentence_count", "word_count", "avg_sentence_length"):
            self.assertIn(key, stats, f"Missing stats key: {key!r}")

    def test_paragraphs_is_list(self):
        result = segment_text("Text here.")
        self.assertIsInstance(result["paragraphs"], list)

    def test_sentences_is_list(self):
        result = segment_text("Text here.")
        self.assertIsInstance(result["sentences"], list)


class TestPipelineIntegration(unittest.TestCase):
    """normalize_text → segment_text pipeline on realistic essay fragment."""

    ESSAY_FRAGMENT = (
        "\u201CClimate change\u201D is one of the most pressing issues of our time.\n"
        "Scientists have documented rising temperatures since the industrial era.\n"
        "\n"
        "The evidence is overwhelming: sea levels are rising, and extreme weather\n"
        "events are becoming more frequent. Governments must act now\u2014or face\n"
        "catastrophic consequences for future generations."
    )

    def test_smart_quotes_removed_in_pipeline(self):
        normalised = normalize_text(self.ESSAY_FRAGMENT)
        self.assertNotIn("\u201C", normalised)
        self.assertNotIn("\u201D", normalised)

    def test_em_dash_converted_in_pipeline(self):
        normalised = normalize_text(self.ESSAY_FRAGMENT)
        self.assertNotIn("\u2014", normalised)
        self.assertIn("--", normalised)

    def test_stray_line_breaks_repaired_in_pipeline(self):
        normalised = normalize_text(self.ESSAY_FRAGMENT)
        result = segment_text(normalised)
        # After normalisation the fragment has 2 paragraphs
        self.assertEqual(result["stats"]["paragraph_count"], 2)

    def test_word_count_reasonable(self):
        normalised = normalize_text(self.ESSAY_FRAGMENT)
        result = segment_text(normalised)
        self.assertGreater(result["stats"]["word_count"], 30)

    def test_sentence_count_at_least_three(self):
        normalised = normalize_text(self.ESSAY_FRAGMENT)
        result = segment_text(normalised)
        self.assertGreaterEqual(result["stats"]["sentence_count"], 3)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    unittest.main(verbosity=2)

