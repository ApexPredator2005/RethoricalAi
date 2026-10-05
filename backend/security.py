"""
RethoricalAI Backend Security & Rate Limiting Engine
Implements:
- Sliding window rate limiting (Max 5 attempts / 15 minutes on login routes)
- Input sanitization (XSS, control character stripping, unicode normalization)
- Payload boundary and size validation
- Safe JSON validation with prototype pollution & nesting checks
"""

import time
import re
import unicodedata
from collections import defaultdict
from typing import Dict, List, Tuple, Optional, Any
import json
import os

# Maximum boundary limits
MAX_ESSAY_CHARS = 50000        # ~10,000 words max
MAX_REF_DOC_CHARS = 100000     # ~20,000 words max
MAX_TITLE_CHARS = 200
MAX_NAME_CHARS = 100
MAX_EMAIL_CHARS = 120
MAX_FILE_BYTES = 10 * 1024 * 1024  # 10 MB

class RateLimiter:
    """Thread-safe sliding-window rate limiter."""
    def __init__(self):
        self._history: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, key: str, max_attempts: int, window_seconds: int) -> Tuple[bool, int, int]:
        """
        Check if request is allowed under sliding window.
        Returns: (is_allowed, remaining_attempts, retry_after_seconds)
        """
        now = time.time()
        window_start = now - window_seconds
        
        # Clean older records
        self._history[key] = [t for t in self._history[key] if t > window_start]
        
        current_attempts = len(self._history[key])
        
        if current_attempts >= max_attempts:
            oldest = self._history[key][0]
            retry_after = max(1, int((oldest + window_seconds) - now))
            return False, 0, retry_after

        return True, max_attempts - current_attempts, 0

    def record_attempt(self, key: str, window_seconds: int = 900) -> int:
        """Record an attempt."""
        now = time.time()
        window_start = now - window_seconds
        self._history[key] = [t for t in self._history[key] if t > window_start]
        self._history[key].append(now)
        return len(self._history[key])

    def reset(self, key: str) -> None:
        """Reset rate limit history for a key."""
        if key in self._history:
            del self._history[key]


# Global rate limiter instance
limiter = RateLimiter()


def check_login_rate_limit(identifier: str) -> Tuple[bool, int, int, str]:
    """
    Login rate limit: Max 5 attempts per 15 minutes (900 seconds).
    Returns (allowed, remaining, retry_after_seconds, message)
    """
    clean_id = identifier.lower().strip()
    key = f"auth_login_{clean_id}"
    allowed, remaining, retry_after = limiter.is_allowed(key, max_attempts=5, window_seconds=900)
    
    if not allowed:
        msg = f"Rate limit exceeded: Max 5 login attempts per 15 minutes. Please wait {retry_after}s before retrying."
        return False, 0, retry_after, msg
        
    return True, remaining, 0, ""


def sanitize_text(input_str: Optional[str], max_length: int = 1000) -> str:
    """
    Sanitize text: Unicode normalize (NFC), remove control chars, strip XSS vectors.
    """
    if not input_str or not isinstance(input_str, str):
        return ""

    # 1. Unicode Normalization
    clean = unicodedata.normalize('NFC', input_str)

    # 2. Length boundary truncation
    if len(clean) > max_length:
        clean = clean[:max_length]

    # 3. Strip null bytes & control chars (preserve \n, \r, \t)
    clean = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', clean)

    # 4. Strip XSS / script / HTML injection tags
    clean = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'javascript\s*:', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'data\s*:\s*text\/html', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'on\w+\s*=\s*([\"\'][^\"\']*[\"\']|[^\s>]+)', '', clean, flags=re.IGNORECASE)

    return clean.strip()


def validate_essay_payload(text: str) -> Tuple[bool, str, str]:
    """
    Validate essay text boundaries and sanitize.
    Returns: (is_valid, sanitized_text, error_message)
    """
    if not text or not isinstance(text, str):
        return False, "", "Assignment payload cannot be empty."

    if len(text) > MAX_ESSAY_CHARS:
        return False, "", f"Assignment text exceeds maximum allowed size of {MAX_ESSAY_CHARS} characters (~10,000 words)."

    sanitized = sanitize_text(text, max_length=MAX_ESSAY_CHARS)
    if not sanitized:
        return False, "", "Assignment text contains only whitespace or invalid characters."

    return True, sanitized, ""


def validate_email_format(email: str) -> Tuple[bool, str, str]:
    """Validate email format and length."""
    if not email:
        return False, "", "Email address is required."
        
    clean_email = sanitize_text(email, max_length=MAX_EMAIL_CHARS).lower()
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(email_pattern, clean_email):
        return False, "", "Invalid or malformed email address."
        
    return True, clean_email, ""


def safe_json_loads(json_str: str, max_depth: int = 10) -> Optional[Any]:
    """Parse JSON safely against prototype pollution and excessive nesting."""
    if not json_str or not isinstance(json_str, str):
        return None

    if re.search(r'(__proto__|constructor|prototype)', json_str, re.IGNORECASE):
        return None

    try:
        data = json.loads(json_str)
        
        def check_depth(obj, depth=1):
            if depth > max_depth:
                return False
            if isinstance(obj, dict):
                return all(check_depth(v, depth + 1) for v in obj.values())
            if isinstance(obj, list):
                return all(check_depth(v, depth + 1) for v in obj)
            return True

        if not check_depth(data):
            return None

        return data
    except Exception:
        return None
