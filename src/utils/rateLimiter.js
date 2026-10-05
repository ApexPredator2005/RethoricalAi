/**
 * RethoricalAI - Client & Edge Rate Limiter Module
 * Enforces sliding-window rate limiting on sensitive routes & actions:
 * - Max 5 attempts per 15 minutes on login/auth routes
 * - Max 30 requests per minute on API/evaluation endpoints
 */

const STORAGE_KEY_PREFIX = 'rethorical_rl_';

export const RATE_LIMIT_CONFIGS = {
  LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    name: 'Login / Authentication'
  },
  SUBMIT_ASSIGNMENT: {
    maxAttempts: 10,
    windowMs: 60 * 1000, // 1 minute
    name: 'Assignment Submission'
  },
  EVALUATE_FEEDBACK: {
    maxAttempts: 20,
    windowMs: 60 * 1000, // 1 minute
    name: 'AI Feedback Generation'
  },
  CALENDAR_EXPORT: {
    maxAttempts: 15,
    windowMs: 60 * 1000, // 1 minute
    name: 'Calendar Export'
  }
};

/**
 * Retrieve attempt history for a specific key
 */
function getAttempts(key) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist attempt history
 */
function saveAttempts(key, timestamps) {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(timestamps));
  } catch (err) {
    console.warn('Storage unavailable for rate limiter:', err);
  }
}

/**
 * Sliding Window Rate Limiter
 * @param {string} key Identifier (e.g. 'login_user@example.com' or 'general_login')
 * @param {number} maxAttempts Maximum allowed attempts in window
 * @param {number} windowMs Time window in milliseconds
 * @returns {{ allowed: boolean, remainingAttempts: number, lockoutSeconds: number, resetTimeMs: number }}
 */
export function checkRateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Filter out attempts outside the sliding window
  const recentAttempts = getAttempts(key).filter(ts => ts > windowStart);
  
  if (recentAttempts.length >= maxAttempts) {
    const oldestInWindow = recentAttempts[0];
    const resetTimeMs = oldestInWindow + windowMs;
    const lockoutSeconds = Math.max(1, Math.ceil((resetTimeMs - now) / 1000));
    
    return {
      allowed: false,
      remainingAttempts: 0,
      totalAttempts: recentAttempts.length,
      lockoutSeconds,
      resetTimeMs,
      message: `Rate limit exceeded: Max ${maxAttempts} attempts per ${Math.round(windowMs / 60000)} minutes. Please wait ${lockoutSeconds}s before retrying.`
    };
  }

  return {
    allowed: true,
    remainingAttempts: maxAttempts - recentAttempts.length,
    totalAttempts: recentAttempts.length,
    lockoutSeconds: 0,
    resetTimeMs: 0,
    message: ''
  };
}

/**
 * Record a new attempt against the rate limiter
 */
export function recordAttempt(key, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const recentAttempts = getAttempts(key).filter(ts => ts > windowStart);
  recentAttempts.push(now);
  saveAttempts(key, recentAttempts);
  return recentAttempts.length;
}

/**
 * Reset rate limit counter upon successful authenticated action
 */
export function resetRateLimit(key) {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  } catch (err) {
    console.warn('Could not reset rate limit key:', err);
  }
}

/**
 * Specific Login Rate Limiter: 5 attempts per 15 minutes
 */
export function checkLoginRateLimit(identifier = 'global_login') {
  const cleanId = String(identifier).toLowerCase().trim();
  const key = `auth_login_${cleanId}`;
  return checkRateLimit(key, RATE_LIMIT_CONFIGS.LOGIN.maxAttempts, RATE_LIMIT_CONFIGS.LOGIN.windowMs);
}

export function recordFailedLogin(identifier = 'global_login') {
  const cleanId = String(identifier).toLowerCase().trim();
  const key = `auth_login_${cleanId}`;
  return recordAttempt(key, RATE_LIMIT_CONFIGS.LOGIN.windowMs);
}

export function resetLoginRateLimit(identifier = 'global_login') {
  const cleanId = String(identifier).toLowerCase().trim();
  const key = `auth_login_${cleanId}`;
  resetRateLimit(key);
}
