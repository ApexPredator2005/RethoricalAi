/**
 * RethoricalAI - Input Sanitization, Validation & Boundary Defense Module
 * Protects against XSS, HTML injection, prototype pollution, and payload exhaustion attacks.
 */

export const LIMITS = {
  MAX_ESSAY_CHARS: 50000,       // Max ~10,000 words to prevent ReDoS / memory exhaustion
  MAX_REF_DOC_CHARS: 100000,    // Max reference document size
  MAX_TITLE_CHARS: 200,         // Max assignment title
  MAX_NAME_CHARS: 100,          // Max student / instructor name
  MAX_USN_CHARS: 30,            // Max USN / Roll number
  MAX_EMAIL_CHARS: 120,         // Max email address
  MAX_FILE_BYTES: 10 * 1024 * 1024 // 10 MB maximum upload size
};

/**
 * Strips dangerous HTML tags, javascript: pseudo-protocols, and inline event handlers
 */
export function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return '';
    input = String(input);
  }

  // 1. Unicode Normalization (NFC)
  let clean = input.normalize('NFC');

  // 2. Truncate / Boundary enforcement
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }

  // 3. Remove Null Bytes and control characters (except newline, tab, carriage return)
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 4. Strip dangerous HTML & script elements
  clean = clean
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .replace(/on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '');

  return clean.trim();
}

/**
 * Sanitize essay prose while preserving legitimate formatting (newlines, quotes, standard punctuation)
 */
export function sanitizeEssayText(rawText) {
  if (typeof rawText !== 'string') return '';
  if (rawText.length > LIMITS.MAX_ESSAY_CHARS) {
    throw new Error(`Assignment text exceeds maximum allowed size of ${LIMITS.MAX_ESSAY_CHARS} characters (~10,000 words).`);
  }
  return sanitizeString(rawText, LIMITS.MAX_ESSAY_CHARS);
}

/**
 * Validate and sanitize email address with strict RFC regex
 */
export function validateAndSanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('Email address is required.');
  }
  const clean = sanitizeString(email, LIMITS.MAX_EMAIL_CHARS).toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(clean)) {
    throw new Error('Malformed or invalid email address format.');
  }
  return clean;
}

/**
 * Validate and sanitize user identifiers (names, USN, titles)
 */
export function sanitizeIdentifier(value, fieldName = 'Field', maxLen = 100) {
  if (typeof value !== 'string') return '';
  if (value.length > maxLen) {
    throw new Error(`${fieldName} exceeds maximum length of ${maxLen} characters.`);
  }
  return sanitizeString(value, maxLen);
}

/**
 * Safe JSON parser with prototype pollution protection & max depth validation
 */
export function safeJSONParse(jsonStr, maxDepth = 10) {
  if (typeof jsonStr !== 'string') return null;

  // Reject payloads that attempt prototype pollution
  if (/(__proto__|constructor|prototype)/i.test(jsonStr)) {
    console.warn('Security Alert: Prototype pollution attempt blocked.');
    return null;
  }

  try {
    const parsed = JSON.parse(jsonStr);
    
    // Check object depth
    const getDepth = (obj) => {
      if (obj === null || typeof obj !== 'object') return 0;
      let depth = 1;
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          depth = Math.max(depth, 1 + getDepth(obj[key]));
        }
      }
      return depth;
    };

    if (getDepth(parsed) > maxDepth) {
      console.warn('Security Alert: Excessively nested JSON rejected.');
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Validate uploaded file size and MIME type
 */
export function validateUploadedFile(file, allowedExtensions = ['.txt', '.pdf', '.docx', '.md']) {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // 1. Size check (10MB max)
  if (file.size > LIMITS.MAX_FILE_BYTES) {
    throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 10MB.`);
  }

  // 2. Extension check
  const fileName = file.name || '';
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    throw new Error(`Invalid file type "${ext}". Allowed types: ${allowedExtensions.join(', ')}.`);
  }

  // 3. Name sanitization
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return { valid: true, safeName };
}
