"""
analytics_engine.py
"""
import json
import os
import sys
from typing import Optional
from collections import defaultdict

try:
    from feedback_engine import _get_client, _load_api_key, _extract_json
except ImportError:
    pass

TAXONOMY = {
    "grammar": ["subject-verb agreement", "tense consistency", "comma splice", "run-on", "punctuation", "spelling", "mechanics"],
    "argument": ["weak thesis", "no counterargument", "insufficient evidence", "generalization", "unclear reasoning"],
    "coherence": ["transition", "paragraphing", "flow", "organization", "topic sentence"],
    "originality": ["voice", "cliche", "repetitive", "stylistic flair"]
}

def _match_keyword(text: str) -> str:
    text_lower = text.lower()
    for category, keywords in TAXONOMY.items():
        for kw in keywords:
            if kw in text_lower or kw.replace("-", " ") in text_lower:
                return kw
    return "other"

def aggregate_class_feedback(feedback_results: list[dict], rubric: dict) -> dict:
    if not feedback_results:
        return {}
    
    crit_totals = defaultdict(float)
    crit_counts = defaultdict(int)
    keyword_counts = defaultdict(int)
    total_students = len(feedback_results)

    for result in feedback_results:
        crit_scores = result.get("criterion_scores", {})
        for cid, info in crit_scores.items():
            if isinstance(info, dict) and "score" in info:
                crit_totals[cid] += float(info["score"])
                crit_counts[cid] += 1
                
        improvements = result.get("improvements", [])
        student_keywords = set()
        for imp in improvements:
            kw = _match_keyword(imp)
            if kw != "other":
                student_keywords.add(kw)
        
        for kw in student_keywords:
            keyword_counts[kw] += 1
            
    per_crit_avg = {cid: round((crit_totals[cid]/crit_counts[cid]), 2) for cid in crit_totals}
    
    weakest_criterion = None
    if per_crit_avg:
        weakest_criterion = min(per_crit_avg, key=per_crit_avg.get)
        
    sorted_gaps = sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True)
    top_3_gaps = [{"gap": k, "affected_pct": round((v / total_students) * 100.0, 1)} for k, v in sorted_gaps[:3]]
    
    suggested_resources = []
    if top_3_gaps:
        try:
            api_key = _load_api_key()
            if api_key:
                model = _get_client("gemini-2.5-flash", api_key)
                for gap_info in top_3_gaps:
                    gap = gap_info["gap"]
                    prompt = f"""
                    You are an expert teacher. A common weakness in student essays is "{gap}".
                    Provide ONE concrete concept to review and ONE skill-building exercise to help students improve.
                    Return ONLY a JSON object with this exact schema:
                    {{
                      "gap": "{gap}",
                      "concept_to_read": "<concept description>",
                      "skill_to_practice": "<exercise description>"
                    }}
                    """
                    response = model.generate_content(prompt)
                    extracted = _extract_json(response.text)
                    parsed = json.loads(extracted)
                    suggested_resources.append(parsed)
            else:
                raise ValueError("No API key")
        except Exception as e:
            for gap_info in top_3_gaps:
                suggested_resources.append({
                    "gap": gap_info["gap"],
                    "concept_to_read": f"Review standard guidelines for {gap_info['gap']}.",
                    "skill_to_practice": f"Practice revising sentences focusing on {gap_info['gap']}."
                })
                
    return {
        "per_criterion_class_average": per_crit_avg,
        "weakest_criterion": weakest_criterion,
        "concept_gaps": top_3_gaps,
        "suggested_resources": suggested_resources
    }

def student_drilldown(feedback_result: dict, class_averages: dict = None) -> dict:
    if class_averages is None:
        class_averages = {}
    
    crit_scores = feedback_result.get("criterion_scores", {})
    scores_vs_class = {}
    for cid, info in crit_scores.items():
        if isinstance(info, dict) and "score" in info:
            score = float(info["score"])
            avg = class_averages.get(cid)
            scores_vs_class[cid] = {
                "score": score,
                "class_average": avg,
                "delta": round(score - avg, 2) if avg is not None else None
            }
            
    improvements = feedback_result.get("improvements", [])
    student_keywords = list(set(_match_keyword(imp) for imp in improvements if _match_keyword(imp) != "other"))
    top_2 = student_keywords[:2]
    
    resources = []
    for kw in top_2:
        resources.append({
            "gap": kw,
            "concept_to_read": f"Review {kw} fundamentals.",
            "skill_to_practice": f"Complete exercises focusing on {kw}."
        })
        
    return {
        "student_id": feedback_result.get("essay_id", "unknown"),
        "scores_vs_class": scores_vs_class,
        "top_improvement_areas": top_2,
        "suggested_resources": resources
    }