"""
test_analytics_engine.py - Unit tests for analytics_engine.py.
"""
import unittest
from unittest.mock import patch
import json
from analytics_engine import aggregate_class_feedback, student_drilldown, _match_keyword

class TestAnalyticsEngine(unittest.TestCase):
    def setUp(self):
        self.rubric = {"criteria": [{"id": "grammar"}, {"id": "argument"}, {"id": "coherence"}, {"id": "originality"}]}
        self.fake_results = [
            {
                "essay_id": "student_1",
                "criterion_scores": {
                    "grammar": {"score": 5},
                    "argument": {"score": 4}
                },
                "improvements": ["Needs to fix comma splices.", "Weak thesis statement.", "Work on flow."]
            },
            {
                "essay_id": "student_2",
                "criterion_scores": {
                    "grammar": {"score": 8},
                    "argument": {"score": 5}
                },
                "improvements": ["Check your subject-verb agreement.", "Weak thesis and missing evidence."]
            },
            {
                "essay_id": "student_3",
                "criterion_scores": {
                    "grammar": {"score": 6},
                    "argument": {"score": 3}
                },
                "improvements": ["Too many comma splices", "Very weak thesis and generalizations."]
            }
        ]

    def test_keyword_matching(self):
        self.assertEqual(_match_keyword("You have a comma splice here."), "comma splice")
        self.assertEqual(_match_keyword("The thesis is weak thesis statement."), "weak thesis")
        self.assertEqual(_match_keyword("Just some other comment."), "other")

    @patch('analytics_engine._get_client')
    @patch('analytics_engine._load_api_key')
    def test_aggregate_class_feedback(self, mock_load, mock_get):
        mock_load.return_value = "fake_key"
        mock_model = unittest.mock.Mock()
        mock_get.return_value = mock_model
        
        class FakeResponse:
            def __init__(self, text):
                self.text = text
        
        def fake_generate(prompt):
            if "weak thesis" in prompt:
                return FakeResponse('{"gap": "weak thesis", "concept_to_read": "Read about thesis.", "skill_to_practice": "Write 3 thesis."}')
            return FakeResponse('{"gap": "comma splice", "concept_to_read": "Read about commas.", "skill_to_practice": "Punctuate."}')
            
        mock_model.generate_content.side_effect = fake_generate
        
        agg = aggregate_class_feedback(self.fake_results, self.rubric)
        
        self.assertAlmostEqual(agg["per_criterion_class_average"]["grammar"], 6.33, places=2)
        self.assertAlmostEqual(agg["per_criterion_class_average"]["argument"], 4.0, places=2)
        self.assertEqual(agg["weakest_criterion"], "argument")
        
        gaps = {g["gap"]: g["affected_pct"] for g in agg["concept_gaps"]}
        self.assertIn("weak thesis", gaps)
        self.assertIn("comma splice", gaps)
        self.assertAlmostEqual(gaps["weak thesis"], 100.0)
        self.assertAlmostEqual(gaps["comma splice"], 66.7, places=1)
        
        resources = agg["suggested_resources"]
        self.assertEqual(len(resources), len(agg["concept_gaps"]))

    def test_student_drilldown(self):
        avgs = {"grammar": 7.0, "argument": 5.0}
        drill = student_drilldown(self.fake_results[0], class_averages=avgs)
        
        self.assertEqual(drill["student_id"], "student_1")
        self.assertEqual(drill["scores_vs_class"]["grammar"]["delta"], -2.0)
        self.assertEqual(drill["scores_vs_class"]["argument"]["delta"], -1.0)
        
        self.assertGreater(len(drill["top_improvement_areas"]), 0)
        self.assertIn(drill["top_improvement_areas"][0], ["comma splice", "weak thesis", "flow"])

if __name__ == "__main__":
    unittest.main()