"""
Unit tests for RethoricalAI Backend Security & Rate Limiting Module
"""

import unittest
import time
from security import (
    RateLimiter,
    check_login_rate_limit,
    sanitize_text,
    validate_essay_payload,
    validate_email_format,
    safe_json_loads,
    MAX_ESSAY_CHARS
)

class TestSecurityModule(unittest.TestCase):
    def setUp(self):
        self.limiter = RateLimiter()

    def test_login_rate_limiting_allows_up_to_5_attempts(self):
        user = "test_user@jssstuniv.in"
        # 5 attempts should all be allowed
        for i in range(5):
            allowed, remaining, retry_after, _ = check_login_rate_limit(user)
            self.assertTrue(allowed)
            self.limiter.record_attempt(f"auth_login_{user}", window_seconds=900)

        # 6th attempt should be blocked
        # Note: we use self.limiter for testing window
        limiter_test = RateLimiter()
        for i in range(5):
            limiter_test.record_attempt("test_key", window_seconds=900)
            
        allowed, remaining, retry_after = limiter_test.is_allowed("test_key", max_attempts=5, window_seconds=900)
        self.assertFalse(allowed)
        self.assertEqual(remaining, 0)
        self.assertGreater(retry_after, 0)

    def test_xss_sanitization(self):
        malicious = "<script>alert('xss')</script>Hello <b>World</b><iframe src='bad.html'></iframe>"
        clean = sanitize_text(malicious)
        self.assertNotIn("<script>", clean)
        self.assertNotIn("<iframe>", clean)
        self.assertIn("Hello", clean)

    def test_javascript_protocol_sanitization(self):
        malicious = "<a href='javascript:stealCookies()'>Click</a> onmouseover='bad()'"
        clean = sanitize_text(malicious)
        self.assertNotIn("javascript:", clean)
        self.assertNotIn("onmouseover", clean)

    def test_unicode_normalization_and_null_bytes(self):
        null_byte_str = "Clean\x00Text\x08WithNulls"
        clean = sanitize_text(null_byte_str)
        self.assertEqual(clean, "CleanTextWithNulls")

    def test_essay_boundary_rejection(self):
        oversized = "A" * (MAX_ESSAY_CHARS + 100)
        is_valid, text, err = validate_essay_payload(oversized)
        self.assertFalse(is_valid)
        self.assertIn("exceeds maximum allowed size", err)

    def test_valid_essay_payload(self):
        valid = "This is a legitimate essay discussing SOLID principles in enterprise software."
        is_valid, text, err = validate_essay_payload(valid)
        self.assertTrue(is_valid)
        self.assertEqual(text, valid)
        self.assertEqual(err, "")

    def test_email_validation(self):
        valid_email = "pratyush.raj@jssstuniv.in"
        is_valid, clean, err = validate_email_format(valid_email)
        self.assertTrue(is_valid)
        self.assertEqual(clean, valid_email)

        invalid_email = "malformed-email@@domain..com<script>"
        is_valid, clean, err = validate_email_format(invalid_email)
        self.assertFalse(is_valid)

    def test_safe_json_loads_blocks_prototype_pollution(self):
        pollution_payload = '{"__proto__": {"admin": true}}'
        res = safe_json_loads(pollution_payload)
        self.assertIsNone(res)

    def test_safe_json_loads_valid_payload(self):
        valid_json = '{"title": "Lab Report", "score": 95}'
        res = safe_json_loads(valid_json)
        self.assertIsNotNone(res)
        self.assertEqual(res.get("score"), 95)

if __name__ == '__main__':
    unittest.main()
