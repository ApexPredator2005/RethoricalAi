from abc import ABC, abstractmethod

class LMSAdapter(ABC):
    @abstractmethod
    def connect(self, credentials: dict) -> bool:
        pass

    @abstractmethod
    def list_courses(self) -> list:
        pass

    @abstractmethod
    def list_assignments(self, course_id: str) -> list:
        pass

    @abstractmethod
    def push_grade(self, course_id: str, assignment_id: str, student_id: str, score: float, feedback_summary: str) -> dict:
        pass

    @abstractmethod
    def sync_status(self) -> dict:
        pass