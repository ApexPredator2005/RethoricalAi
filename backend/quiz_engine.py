"""
quiz_engine.py — Grammar Self-Improvement Quiz Generator for Marginalia.

Generates targeted, contextual multiple-choice quiz questions based on
a student's essay text and identified grammar/structural improvement areas.
"""

import os
import json
import re
from typing import List, Dict, Any, Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


def _clean_json_string(text: str) -> str:
    """Strip markdown fences, leading/trailing formatting from raw LLM output."""
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return text


def _build_quiz_prompt(normalized_text: str, improvements: List[Dict[str, Any]]) -> str:
    """Constructs prompt instructing Gemini to build 4 contextual MCQs."""
    improvements_summary = "\n".join(
        [f"- {imp.get('title', 'Improvement')}: {imp.get('detail', '')}" for imp in improvements]
    ) if improvements else "- General grammar, punctuation, and sentence clarity."

    return f"""You are an expert English writing instructor.
Based on the following student essay and the identified improvement areas, generate EXACTLY 4 targeted multiple-choice questions to help the student practice and master these specific grammar, syntax, or punctuation patterns.

--- STUDENT ESSAY EXCERPT ---
{normalized_text[:2500]}

--- IDENTIFIED IMPROVEMENT AREAS ---
{improvements_summary}

--- INSTRUCTIONS ---
1. Create exactly 4 multiple-choice questions.
2. Use real or slightly adapted sentences from the student's essay as the question stems where possible.
3. Provide 4 distinct options per question.
4. "correct_index" must be an integer from 0 to 3 indicating the correct answer in "options".
5. "hint" should provide a helpful nudge without giving away the answer.
6. "insight" MUST explain the grammatical rule AND include a constructive note tying it directly to this student's writing habit.

Return ONLY a valid JSON object with NO markdown wrapping, matching this exact schema:
{{
  "questions": [
    {{
      "prompt": "Which revision best corrects the comma splice in this sentence from your essay: '...'?",
      "options": [
        "Option A revision",
        "Option B revision",
        "Option C revision",
        "Option D revision"
      ],
      "correct_index": 0,
      "hint": "Remember that two independent clauses cannot be joined by only a comma.",
      "insight": "Comma splices occur when two complete thoughts are linked with just a comma. In your essay, separating these clauses with a semicolon or coordinating conjunction strengthens your academic rhythm."
    }}
  ]
}}
"""


def _generate_fallback_quiz(normalized_text: str, improvements: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Fallback generator when API is offline or key is missing."""
    topics = [imp.get("title", "Grammar Concept") for imp in improvements] if improvements else ["Sentence Clarity", "Punctuation"]
    t1 = topics[0] if len(topics) > 0 else "Subject-Verb Agreement"
    t2 = topics[1] if len(topics) > 1 else "Comma Usage & Splices"
    t3 = topics[2] if len(topics) > 2 else "Tense Consistency"
    t4 = "Thesis & Transition Clarity"

    return {
        "questions": [
            {
                "prompt": f"Identify the sentence that correctly resolves the issue regarding '{t1}':",
                "options": [
                    "The collection of arguments clearly demonstrates the validity of the thesis.",
                    "The collection of arguments clearly demonstrate the validity of the thesis.",
                    "The collection of arguments are demonstrating the thesis validity clearly.",
                    "The collection of arguments, clearly demonstrates the validity of the thesis."
                ],
                "correct_index": 0,
                "hint": "Focus on the true subject of the sentence ('collection'), which is singular.",
                "insight": f"Singular collective subjects require singular verbs. In your writing, matching the verb to the head noun rather than modifying prepositional phrases prevents {t1.lower()} errors."
            },
            {
                "prompt": f"Which revision best repairs punctuation relating to '{t2}'?",
                "options": [
                    "The author presents compelling evidence; however, the conclusion remains unsupported.",
                    "The author presents compelling evidence, however the conclusion remains unsupported.",
                    "The author presents compelling evidence however, the conclusion remains unsupported.",
                    "The author presents compelling evidence, however, the conclusion remains unsupported."
                ],
                "correct_index": 0,
                "hint": "Conjunctive adverbs like 'however' connecting two independent clauses need a semicolon before and a comma after.",
                "insight": "Using semicolons before conjunctive adverbs elevates formal academic structure."
            },
            {
                "prompt": f"Regarding '{t3}', choose the sentence that maintains proper tense consistency:",
                "options": [
                    "When the protagonist enters the room, he noticed the missing documents.",
                    "When the protagonist enters the room, he notices the missing documents.",
                    "When the protagonist had entered the room, he will notice the missing documents.",
                    "When the protagonist entered the room, he notices the missing documents."
                ],
                "correct_index": 1,
                "hint": "Literary analysis conventions require the present tense when discussing textual events.",
                "insight": "Maintaining the literary present tense ensures consistent narration across your body paragraphs."
            },
            {
                "prompt": f"Select the transition that best enhances coherence for '{t4}':",
                "options": [
                    "Furthermore, empirical studies reinforce this interpretation.",
                    "Also, empirical studies are reinforcing this interpretation.",
                    "Empirical studies, besides, reinforce this interpretation.",
                    "On the other hand, empirical studies likewise reinforce this same point."
                ],
                "correct_index": 0,
                "hint": "Choose a formal transition that signals additional supporting evidence.",
                "insight": "Varied formal transitions direct the reader smoothly between analytical claims."
            }
        ]
    }


def generate_quiz(normalized_text: str, improvements: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Prompt Gemini for exactly 4 multiple-choice questions targeting this essay's
    actual grammar patterns.

    Returns:
        {
            "questions": [
                {
                    "prompt": str,
                    "options": [str, str, str, str],
                    "correct_index": int,
                    "hint": str,
                    "insight": str
                }, ...
            ]
        }
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_key_here":
        return _generate_fallback_quiz(normalized_text, improvements)

    prompt = _build_quiz_prompt(normalized_text, improvements)

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(MODEL_NAME)

        # First call attempt
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.3, "response_mime_type": "application/json"}
        )
        cleaned = _clean_json_string(response.text)
        data = json.loads(cleaned)

        if "questions" in data and len(data["questions"]) == 4:
            return data

        # Retry once with stricter instruction if count/schema is off
        retry_prompt = prompt + "\n\nCRITICAL: Return ONLY valid JSON with EXACTLY 4 questions."
        retry_response = model.generate_content(
            retry_prompt,
            generation_config={"temperature": 0.1, "response_mime_type": "application/json"}
        )
        cleaned_retry = _clean_json_string(retry_response.text)
        data_retry = json.loads(cleaned_retry)
        if "questions" in data_retry and len(data_retry["questions"]) == 4:
            return data_retry

        return _generate_fallback_quiz(normalized_text, improvements)

    except Exception:
        # Graceful fallback on network/quota/import error
        return _generate_fallback_quiz(normalized_text, improvements)


if __name__ == "__main__":
    sample_text = "The authors argument was very good however they didnt cite no sources."
    sample_imps = [
        {"title": "Punctuation & Comma Splices", "detail": "Missing semicolon before conjunctive adverb 'however'."},
        {"title": "Double Negatives", "detail": "Used 'didnt cite no sources'."}
    ]
    quiz = generate_quiz(sample_text, sample_imps)
    print(json.dumps(quiz, indent=2))
