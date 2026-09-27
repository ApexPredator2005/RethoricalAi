import os
import datetime
from .base import LMSAdapter

try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from google.auth.transport.requests import Request
    from googleapiclient.errors import HttpError
except ImportError:
    pass

SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students"
]

class GoogleClassroomAdapter(LMSAdapter):
    def __init__(self):
        self.creds = None
        self.service = None
        self.last_sync = None
        self.last_error = None
        
    def connect(self, credentials: dict = None) -> bool:
        if not credentials:
            credentials = {}
        
        token_path = credentials.get("token_path", "token.json")
        client_id = os.environ.get("GOOGLE_CLASSROOM_CLIENT_ID", "")
        client_secret = os.environ.get("GOOGLE_CLASSROOM_CLIENT_SECRET", "")
        
        if not client_id or not client_secret:
            self.last_error = "Missing GOOGLE_CLASSROOM_CLIENT_ID or SECRET in env."
            return False
            
        try:
            if os.path.exists(token_path):
                self.creds = Credentials.from_authorized_user_file(token_path, SCOPES)
            
            if not self.creds or not self.creds.valid:
                if self.creds and self.creds.expired and self.creds.refresh_token:
                    self.creds.refresh(Request())
                else:
                    client_config = {
                        "installed": {
                            "client_id": client_id,
                            "client_secret": client_secret,
                            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                            "token_uri": "https://oauth2.googleapis.com/token",
                        }
                    }
                    flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
                    self.creds = flow.run_local_server(port=0)
                    
                with open(token_path, "w") as token:
                    token.write(self.creds.to_json())
                    
            self.service = build("classroom", "v1", credentials=self.creds)
            self.last_sync = datetime.datetime.now().isoformat()
            self.last_error = None
            return True
            
        except Exception as e:
            self.last_error = f"Auth error: {str(e)}"
            return False

    def list_courses(self) -> list:
        if not self.service:
            return []
        try:
            results = self.service.courses().list(pageSize=10).execute()
            courses = results.get("courses", [])
            return [{"id": c.get("id"), "name": c.get("name")} for c in courses]
        except Exception as e:
            self.last_error = str(e)
            return []

    def list_assignments(self, course_id: str) -> list:
        if not self.service:
            return []
        try:
            results = self.service.courses().courseWork().list(courseId=course_id).execute()
            coursework = results.get("courseWork", [])
            return [{"id": cw.get("id"), "title": cw.get("title")} for cw in coursework]
        except Exception as e:
            self.last_error = str(e)
            return []

    def push_grade(self, course_id: str, assignment_id: str, student_id: str, score: float, feedback_summary: str) -> dict:
        if not self.service:
            return {"status": "error", "message": "Not connected"}
        try:
            body = {
                "assignedGrade": score,
                "draftGrade": score
            }
            self.service.courses().courseWork().studentSubmissions().patch(
                courseId=course_id,
                courseWorkId=assignment_id,
                id=student_id,
                updateMask="assignedGrade,draftGrade",
                body=body
            ).execute()
            
            self.last_sync = datetime.datetime.now().isoformat()
            return {"status": "success", "score": score, "feedback": feedback_summary}
        except HttpError as e:
            msg = str(e)
            if "insufficientPermissions" in msg:
                msg = "Missing scopes. Please enable classroom.coursework.students in Google Cloud Console."
            self.last_error = msg
            return {"status": "error", "message": msg}
        except Exception as e:
            self.last_error = str(e)
            return {"status": "error", "message": str(e)}

    def sync_status(self) -> dict:
        return {
            "connected": bool(self.service),
            "last_sync": self.last_sync,
            "error": self.last_error
        }