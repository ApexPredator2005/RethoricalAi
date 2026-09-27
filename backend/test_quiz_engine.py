"""
test_quiz_engine.py — Unit tests for quiz_engine.py.
"""

import unittest
from unittest.mock import MagicMock, patch
import json
import sys
from quiz_engine import generate_quiz, _clean_json_string, _build_quiz_prompt


class TestQuizEngine(unittest.TestCase):

    def test_clean_json_string_fenced(self):
        fenced = "```json\n{\"questions\": []}\n```"
        self.assertEqual(_clean_json_string(fenced), '{"questions": []}')

    def test_clean_json_string_raw(self):
        raw = '{"questions": []}'
        self.assertEqual(_clean_json_string(raw), '{"questions": []}')

    def test_build_quiz_prompt_contains_improvements(self):
        improvements = [{"title": "Subject-Verb Agreement", "detail": "Fix plural verb with singular subject."}]
        prompt = _build_quiz_prompt("Sample essay text here.", improvements)
        self.assertIn("Subject-Verb Agreement", prompt)
        self.assertIn("Sample essay text here.", prompt)
        self.assertIn("EXACTLY 4 targeted multiple-choice questions", prompt)

    def test_fallback_quiz_structure(self):
        """When no API key is set, fallback generates 4 valid questions."""
        result = generate_quiz("Sample essay text", [{"title": "Comma Splice", "detail": "detail"}])
        self.assertIn("questions", result)
        self.assertEqual(len(result["questions"]), 4)
        for q in result["questions"]:
            self.assertIn("prompt", q)
            self.assertIn("options", q)
            self.assertEqual(len(q["options"]), 4)
            self.assertIn("correct_index", q)
            self.assertTrue(0 <= q["correct_index"] <= 3)
            self.assertIn("hint", q)
            self.assertIn("insight", q)

    @patch("quiz_engine.os.getenv")
    def test_mocked_gemini_success(self, mock_getenv):
        mock_getenv.return_value = "fake_api_key"

        mock_payload = {
            "questions": [
                {
                    "prompt": f"Question {i}?",
                    "options": ["A", "B", "C", "D"],
                    "correct_index": 0,
                    "hint": f"Hint {i}",
                    "insight": f"Insight {i}"
                } for i in range(1, 5)
            ]
        }

        mock_google = MagicMock()
        mock_genai = MagicMock()
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = json.dumps(mock_payload)
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model
        mock_google.generativeai = mock_genai

        with patch.dict(sys.modules, {"google": mock_google, "google.generativeai": mock_genai}):
            result = generate_quiz("Sample text", [])
            self.assertEqual(len(result["questions"]), 4)
            self.assertEqual(result["questions"][0]["prompt"], "Question 1?")


if __name__ == "__main__":
    unittest.main()
