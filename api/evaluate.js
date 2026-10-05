/**
 * Vercel Serverless Function: /api/evaluate
 * Secure Gemini AI Gateway with Strict IP Rate Limiting.
 *
 * Security features:
 * 1. GEMINI_API_KEY is stored server-side only (never exposed to browser).
 * 2. Strict Rate Limiting: Max 5 evaluation requests per 15 minutes per client IP.
 * 3. Payload size and character limits enforced to prevent quota abuse.
 */

// In-memory sliding window store for serverless instances
const rateLimitMap = new Map();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;            // Max 5 attempts per 15 mins

function checkRateLimit(clientIp) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const userRecord = rateLimitMap.get(clientIp) || [];
  // Filter out expired timestamps
  const validTimestamps = userRecord.filter(t => t > windowStart);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds
    };
  }

  validTimestamps.push(now);
  rateLimitMap.set(clientIp, validTimestamps);

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length,
    retryAfterSeconds: 0
  };
}

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // 1. Identify Client IP (supports Vercel forwarded headers)
  const clientIp = 
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
    req.headers['x-real-ip'] || 
    req.socket?.remoteAddress || 
    'anonymous_client';

  // 2. Enforce Strict Rate Limiting (5 requests per 15 mins)
  const rateLimitStatus = checkRateLimit(clientIp);
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', rateLimitStatus.remaining);

  if (!rateLimitStatus.allowed) {
    res.setHeader('Retry-After', rateLimitStatus.retryAfterSeconds);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Security limit reached: Max ${MAX_REQUESTS_PER_WINDOW} AI evaluations per 15 minutes. Please try again in ${rateLimitStatus.retryAfterSeconds} seconds.`,
      retryAfterSeconds: rateLimitStatus.retryAfterSeconds
    });
  }

  // 3. Check Server-Side GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on Vercel environment variables.',
      isConfigured: false
    });
  }

  // 4. Sanitize and Validate Request Payload
  const { essayText, rubricName, title, referenceText } = req.body || {};

  if (!essayText || typeof essayText !== 'string' || essayText.trim().length === 0) {
    return res.status(400).json({ error: 'Missing or empty essayText payload.' });
  }

  // Boundary check: Max 30,000 characters to prevent prompt abuse
  if (essayText.length > 30000) {
    return res.status(400).json({ error: 'Essay text exceeds maximum 30,000 character limit.' });
  }

  try {
    const prompt = `
You are an expert collegiate professor evaluating a student's submission.
Assignment Title: "${title || 'Coursework'}"
Evaluation Rubric: "${rubricName || 'Standard STEM Lab Report & Analytical Rubric'}"
Reference Text / Prompt: "${(referenceText || '').slice(0, 3000)}"

Student Submission:
"""
${essayText.slice(0, 15000)}
"""

Please evaluate this submission against the rubric and provide your response as valid, pure JSON without any markdown formatting or code fences.
Format:
{
  "overallScore": 91,
  "letterGrade": "A-",
  "criterionScores": {
    "Grammar & Syntax": 9,
    "Evidence & Grounding": 9,
    "Logical Coherence": 9,
    "Thesis Defense": 9
  },
  "summaryFeedback": "2-3 concise sentences summarizing key strengths and areas for growth.",
  "facultyVoiceTranscript": "A personalized 2-sentence note from the professor with specific constructive advice.",
  "groundingFidelity": 94.5,
  "citations": [
    { "claim": "Sample claim from text", "sourceRef": "Reference Doc Section 1.2", "status": "verified" }
  ]
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API Error:', errBody);
      return res.status(response.status).json({
        error: 'Gemini upstream API returned an error',
        details: errBody
      });
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return res.status(502).json({ error: 'No content received from Gemini model.' });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(candidateText.trim());
    } catch {
      // Fallback in case response had surrounding formatting
      const jsonMatch = candidateText.match(/\{[\s\S]*\}/);
      parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!parsedResult) {
      return res.status(502).json({ error: 'Failed to parse JSON from Gemini response.' });
    }

    return res.status(200).json({
      success: true,
      evaluation: parsedResult,
      remainingAttempts: rateLimitStatus.remaining
    });
  } catch (error) {
    console.error('Serverless evaluation error:', error);
    return res.status(500).json({
      error: 'Internal server error while evaluating with Gemini',
      message: error.message
    });
  }
}
