from .base import LMSAdapter

class MoodleAdapter(LMSAdapter):
    def connect(self, credentials: dict) -> bool:
        return False
        
    def list_courses(self) -> list:
        return [{"status": "not_implemented", "message": "Moodle integration uses the same LMSAdapter interface as Google Classroom -- swap in Moodle's REST API calls here."}]

    def list_assignments(self, course_id: str) -> list:
        return [{"status": "not_implemented", "message": "Moodle integration uses the same LMSAdapter interface as Google Classroom -- swap in Moodle's REST API calls here."}]
        
    def push_grade(self, course_id: str, assignment_id: str, student_id: str, score: float, feedback_summary: str) -> dict:
        return {"status": "not_implemented", "message": "Moodle integration uses the same LMSAdapter interface as Google Classroom -- swap in Moodle's REST API calls here."}
        
    def sync_status(self) -> dict:
        return {"connected": False, "note": "stub adapter"}