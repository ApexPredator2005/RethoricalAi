import unittest
from lms.base import LMSAdapter
from lms.google_classroom import GoogleClassroomAdapter
from lms.canvas import CanvasAdapter
from lms.moodle import MoodleAdapter
from lms.blackboard import BlackboardAdapter

class TestLMSPolymorphism(unittest.TestCase):
    def test_all_adapters_implement_interface(self):
        adapters = [
            GoogleClassroomAdapter(),
            CanvasAdapter(),
            MoodleAdapter(),
            BlackboardAdapter()
        ]
        
        for adapter in adapters:
            self.assertIsInstance(adapter, LMSAdapter)
            self.assertTrue(hasattr(adapter, "connect"))
            self.assertTrue(hasattr(adapter, "list_courses"))
            self.assertTrue(hasattr(adapter, "list_assignments"))
            self.assertTrue(hasattr(adapter, "push_grade"))
            self.assertTrue(hasattr(adapter, "sync_status"))
            
    def test_stub_adapters_return_not_implemented(self):
        stub_adapters = [
            ("Canvas", CanvasAdapter()), 
            ("Moodle", MoodleAdapter()), 
            ("Blackboard", BlackboardAdapter())
        ]
        
        for name, adapter in stub_adapters:
            courses = adapter.list_courses()
            self.assertEqual(courses[0]["status"], "not_implemented")
            self.assertIn("same LMSAdapter interface", courses[0]["message"])
            self.assertIn(name, courses[0]["message"])
            
            res = adapter.push_grade("1", "2", "3", 90.0, "Good")
            self.assertEqual(res["status"], "not_implemented")
            
            status = adapter.sync_status()
            self.assertFalse(status["connected"])
            self.assertEqual(status["note"], "stub adapter")

if __name__ == "__main__":
    unittest.main()