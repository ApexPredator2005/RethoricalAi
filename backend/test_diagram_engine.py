"""
test_diagram_engine.py — Unit tests for diagram_engine.py.
"""
import unittest
from unittest.mock import patch
import json
from diagram_engine import detect_visual_regions, analyze_diagram, evaluate_diagrams, DiagramEngineError

class TestDiagramEngine(unittest.TestCase):
    @patch('diagram_engine._call_vision_api')
    def test_text_only_mock_response(self, mock_call):
        # mock text-only
        mock_call.return_value = "```json\n[]\n```"
        regions = detect_visual_regions(b"fake_image")
        self.assertEqual(regions, [])

    @patch('diagram_engine._call_vision_api')
    def test_analyze_diagram_expected_elements(self, mock_call):
        mock_resp = {
            "region_id": 1,
            "type": "labeled_diagram",
            "extracted_content": {
                "labels_present": ["condensation label", "evaporation arrow"]
            },
            "expected_elements_found": {
                "condensation label": True,
                "evaporation arrow": True,
                "precipitation label": False
            },
            "coverage_pct": 66.7,
            "completeness_notes": "missing precipitation label",
            "confidence": 0.9
        }
        mock_call.return_value = "```json\n" + json.dumps(mock_resp) + "\n```"
        region = {"region_id": 1, "type": "labeled_diagram", "bounding_box_description": "top", "raw_description": "water cycle"}
        expected = ["condensation label", "evaporation arrow", "precipitation label"]
        result = analyze_diagram(b"fake_image", region, expected_elements=expected)
        
        self.assertIn("expected_elements_found", result)
        self.assertIn("coverage_pct", result)
        self.assertEqual(result["coverage_pct"], 66.7)
        self.assertEqual(result["expected_elements_found"]["precipitation label"], False)

    @patch('diagram_engine._call_vision_api')
    def test_defensive_json_parsing(self, mock_call):
        # mock model returning extra prose
        mock_resp = {
            "region_id": 1,
            "type": "bar_chart",
            "bounding_box_description": "top-right",
            "raw_description": "A bar chart."
        }
        mock_call.return_value = "Here is the JSON:\n```json\n[" + json.dumps(mock_resp) + "]\n```\nHope this helps!"
        regions = detect_visual_regions(b"fake_image")
        self.assertEqual(len(regions), 1)
        self.assertEqual(regions[0]["type"], "bar_chart")

if __name__ == "__main__":
    unittest.main()