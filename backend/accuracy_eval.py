"""
accuracy_eval.py — Automated scoring accuracy evaluation against expert labels.

Primary metric: Quadratic Weighted Kappa (QWK), the standard Automated Essay
Scoring (AES) accuracy metric used in the Hewlett Foundation / Kaggle ASAP
competition (Shermis & Burstein, 2013, "Handbook of Automated Essay Evaluation").
QWK penalises large disagreements more than small ones, making it the right
choice for ordinal rubric scales.

IMPORTANT NOTE ON SAMPLE SIZE
------------------------------
# QWK computed over fewer than ~15 essays has very wide confidence intervals
# and should NOT be quoted as a reliable accuracy estimate. With 8 essays,
# a single score disagreement can shift QWK by 0.1–0.2 points.
# RECOMMENDATION: Expand labeled_validation.json to 15–20 essays before
# reporting QWK in a final presentation, paper, or hackathon demo.
# This is standard practice in AES research; reviewers who know the field
# will ask about sample size immediately.

Usage:
    python accuracy_eval.py
    python accuracy_eval.py --rubric data/default_rubric.json \\
                             --labeled data/labeled_validation.json
"""

import json
import math
import os
import sys
import argparse
import textwrap
from datetime import datetime, timezone

# ---- third-party ---------------------------------------------------------
try:
    from sklearn.metrics import cohen_kappa_score
    _SKLEARN_AVAILABLE = True
except ImportError:
    _SKLEARN_AVAILABLE = False
    sys.stderr.write(
        "[accuracy_eval] WARNING: scikit-learn not installed. "
        "QWK will be reported as N/A. Run: pip install scikit-learn\n"
    )

# ---- local ---------------------------------------------------------------
from rubric_engine import load_rubric
from feedback_engine import generate_feedback_from_raw, FeedbackEngineError


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

_DEFAULT_RUBRIC_PATH  = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "data", "default_rubric.json"
)
_DEFAULT_LABELED_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "data", "labeled_validation.json"
)


# ---------------------------------------------------------------------------
# Metric helpers
# ---------------------------------------------------------------------------

def _compute_qwk(
    expert_scores: list,
    ai_scores: list,
    scale_min: int,
    scale_max: int,
) -> float | None:
    """
    Compute Quadratic Weighted Kappa (QWK) between two lists of integer scores.

    Uses sklearn.metrics.cohen_kappa_score with weights='quadratic' — the same
    metric used by the ASAP Automated Essay Scoring competition (Shermis &
    Burstein, 2013). Passing explicit `labels` anchors the rating scale to the
    full rubric range, preventing distortion when extreme values are absent from
    the sample.

    # NOTE: QWK is meaningfully stable only with 15+ essay pairs per criterion.
    # With the 8-essay validation set included here, treat QWK as an indicative
    # number, not a publication-ready estimate. Expand the labeled set before
    # quoting this number in a final report or live demo.

    Returns:
        QWK float in [-1, 1], or None if sklearn is unavailable or the input
        has fewer than 2 distinct values (QWK is undefined when there is no
        variance in either set).
    """
    if not _SKLEARN_AVAILABLE:
        return None

    if len(expert_scores) < 2:
        return None

    # Round AI scores to integers for ordinal treatment
    expert_int = [int(round(s)) for s in expert_scores]
    ai_int     = [int(round(s)) for s in ai_scores]

    # QWK is undefined if one of the lists has zero variance
    if len(set(expert_int)) < 2 or len(set(ai_int)) < 2:
        return None

    labels = list(range(scale_min, scale_max + 1))
    try:
        return float(cohen_kappa_score(expert_int, ai_int,
                                       weights="quadratic", labels=labels))
    except Exception as exc:
        sys.stderr.write(f"[accuracy_eval] WARNING: QWK computation failed: {exc}\n")
        return None


def _compute_agreement_within_1(
    expert_scores: list,
    ai_scores: list,
) -> float:
    """
    Compute the fraction of essay pairs where |ai_score - expert_score| <= 1.

    This is the most interpretable metric for a hackathon or classroom demo:
    "In X% of cases the AI score was within one point of the human expert."

    Returns:
        Float 0.0–1.0.
    """
    if not expert_scores:
        return 0.0
    within_1 = sum(
        1 for e, a in zip(expert_scores, ai_scores)
        if abs(float(a) - float(e)) <= 1.0
    )
    return within_1 / len(expert_scores)


def _compute_mean_confidence(per_essay_results: list, rubric: dict) -> float:
    """
    Compute the mean confidence across all criterion/essay pairs that
    successfully returned a confidence value.
    """
    values = []
    for result in per_essay_results:
        ai_scores = result.get("ai_scores", {})
        for cid in [c["id"] for c in rubric["criteria"]]:
            conf = ai_scores.get(cid, {}).get("confidence")
            if conf is not None:
                values.append(float(conf))
    return round(sum(values) / len(values), 4) if values else 0.0


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def _load_labeled_set(path: str) -> list[dict]:
    """
    Load and parse labeled_validation.json.

    Returns a list of essay dicts, each with:
        essay_id       : str
        text           : str
        expert_scores  : dict  { criterion_id → {"score": int, "rater_notes": str} }
        quality_band   : str
    """
    with open(path, "r", encoding="utf-8-sig") as fh:
        data = json.load(fh)

    essays = data.get("essays", data)  # support both wrapped and bare list formats
    if not isinstance(essays, list):
        raise ValueError(f"labeled_validation.json must contain a list of essays; got {type(essays)!r}")

    return essays


def _load_essay_texts(labeled_essays: list[dict]) -> dict[str, str]:
    """
    Build a dict mapping essay_id → essay text.

    The labeled_validation.json in this project does not embed the essay text
    (it references the same essays in sample_essays.json by essay_id). This
    function loads sample_essays.json from the same data/ directory and builds
    the mapping.

    Falls back to an empty string if a matching essay is not found.
    """
    sample_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "data", "sample_essays.json"
    )
    try:
        with open(sample_path, "r", encoding="utf-8-sig") as fh:
            samples = json.load(fh)
        return {e["essay_id"]: e.get("text", "") for e in samples}
    except Exception as exc:
        sys.stderr.write(
            f"[accuracy_eval] WARNING: Could not load sample_essays.json: {exc}\n"
            "Essay texts will be empty — AI scores will not be meaningful.\n"
        )
        return {}


# ---------------------------------------------------------------------------
# Main evaluation function
# ---------------------------------------------------------------------------

def run_validation(
    rubric_path: str = _DEFAULT_RUBRIC_PATH,
    labeled_path: str = _DEFAULT_LABELED_PATH,
    model_name: str = "gemini-2.5-flash",
    temperature: float = 0.2,
    verbose: bool = False,
) -> dict:
    """
    Run the full accuracy evaluation pipeline.

    For each essay in *labeled_path*:
        1. Load the essay text from sample_essays.json by essay_id.
        2. Call feedback_engine.generate_feedback_from_raw() to get AI scores.
        3. Compare AI per-criterion scores to expert labels.

    Compute per-criterion and overall:
        - agreement_within_1: fraction of essays where |ai - expert| <= 1
        - quadratic_weighted_kappa: sklearn cohen_kappa_score(weights='quadratic')
          This is the standard AES metric (Shermis & Burstein, 2013).

    Args:
        rubric_path:  Path to rubric JSON (default: data/default_rubric.json).
        labeled_path: Path to labeled validation JSON.
        model_name:   Gemini model name.
        temperature:  Sampling temperature for the feedback engine.
        verbose:      If True, print progress to stderr as essays are scored.

    Returns:
        {
          "overall_agreement_pct": float,      # 0.0–100.0
          "overall_qwk":          float | None,
          "per_criterion": {
              "<criterion_id>": {
                  "agreement_pct": float,      # 0.0–100.0
                  "qwk":          float | None,
                  "n_essays":     int,
              }
          },
          "avg_model_confidence": float,       # mean of all confidence values
          "per_essay_results": [
              {
                "essay_id":       str,
                "quality_band":   str,
                "ai_scores":      { criterion_id: {"score": float, "confidence": float} },
                "expert_scores":  { criterion_id: {"score": int} },
                "overall_ai_score": float,
                "overall_letter_grade": str,
                "error":          str | None,  # set if API call failed
              }, ...
          ],
          "metadata": {
              "rubric_path":    str,
              "labeled_path":   str,
              "model_name":     str,
              "temperature":    float,
              "n_essays_total": int,
              "n_essays_scored": int,
              "n_essays_failed": int,
              "timestamp":      str,  # ISO 8601
          }
        }

    Note:
        If the GEMINI_API_KEY is not set, every essay will fail and the
        result will contain only metadata and empty per_essay_results.
    """
    rubric = load_rubric(rubric_path)
    labeled_essays = _load_labeled_set(labeled_path)
    essay_texts = _load_essay_texts(labeled_essays)

    criteria = rubric["criteria"]
    crit_ids = [c["id"] for c in criteria]
    crit_lookup = {c["id"]: c for c in criteria}

    # Accumulate raw scores per criterion for metric computation
    per_crit_expert: dict[str, list] = {cid: [] for cid in crit_ids}
    per_crit_ai:     dict[str, list] = {cid: [] for cid in crit_ids}

    per_essay_results = []
    n_failed = 0

    total = len(labeled_essays)
    for idx, essay_meta in enumerate(labeled_essays, 1):
        essay_id    = essay_meta["essay_id"]
        quality     = essay_meta.get("quality_band", "unknown")
        expert_dict = essay_meta.get("expert_scores", {})
        essay_text  = essay_texts.get(essay_id, "")

        if verbose:
            sys.stderr.write(
                f"[accuracy_eval] Scoring {idx}/{total}: {essay_id} ({quality})...\n"
            )

        # ---- Call the AI feedback engine ----
        essay_result: dict = {
            "essay_id":           essay_id,
            "quality_band":       quality,
            "ai_scores":          {},
            "expert_scores":      {cid: {"score": expert_dict[cid]["score"]}
                                   for cid in crit_ids if cid in expert_dict},
            "overall_ai_score":   None,
            "overall_letter_grade": None,
            "error":              None,
        }

        if not essay_text:
            msg = f"No essay text found for {essay_id!r} in sample_essays.json"
            sys.stderr.write(f"[accuracy_eval] WARNING: {msg}\n")
            essay_result["error"] = msg
            n_failed += 1
            per_essay_results.append(essay_result)
            continue

        try:
            feedback = generate_feedback_from_raw(
                essay_text=essay_text,
                rubric=rubric,
                essay_id=essay_id,
                model_name=model_name,
                temperature=temperature,
            )

            ai_crit_scores = feedback["criterion_scores"]
            essay_result["ai_scores"] = {
                cid: {
                    "score":      ai_crit_scores[cid]["score"],
                    "confidence": ai_crit_scores[cid]["confidence"],
                }
                for cid in crit_ids if cid in ai_crit_scores
            }
            essay_result["overall_ai_score"]      = feedback["overall_score"]
            essay_result["overall_letter_grade"]  = feedback["letter_grade"]

            # Accumulate for aggregate metrics
            for cid in crit_ids:
                if cid in expert_dict and cid in ai_crit_scores:
                    per_crit_expert[cid].append(float(expert_dict[cid]["score"]))
                    per_crit_ai[cid].append(float(ai_crit_scores[cid]["score"]))

        except FeedbackEngineError as exc:
            msg = str(exc)
            sys.stderr.write(f"[accuracy_eval] ERROR: {essay_id}: {msg}\n")
            essay_result["error"] = msg
            n_failed += 1

        except Exception as exc:
            msg = f"Unexpected error: {exc}"
            sys.stderr.write(f"[accuracy_eval] ERROR: {essay_id}: {msg}\n")
            essay_result["error"] = msg
            n_failed += 1

        per_essay_results.append(essay_result)

    # ---- Compute per-criterion metrics ----
    per_criterion_metrics: dict[str, dict] = {}
    all_expert_flat: list = []
    all_ai_flat:     list = []

    for cid in crit_ids:
        expert_list = per_crit_expert[cid]
        ai_list     = per_crit_ai[cid]
        n = len(expert_list)

        crit = crit_lookup[cid]
        agree = _compute_agreement_within_1(expert_list, ai_list)
        qwk   = _compute_qwk(expert_list, ai_list,
                              crit["scale_min"], crit["scale_max"])

        per_criterion_metrics[cid] = {
            "name":         crit["name"],
            "agreement_pct": round(agree * 100, 1),
            "qwk":          round(qwk, 4) if qwk is not None else None,
            "n_essays":     n,
        }

        all_expert_flat.extend(expert_list)
        all_ai_flat.extend(ai_list)

    # ---- Compute overall metrics ----
    # Overall agreement_within_1: mean of per-criterion agreement values
    crit_agreements = [
        v["agreement_pct"] for v in per_criterion_metrics.values()
        if v["n_essays"] > 0
    ]
    overall_agreement_pct = round(
        sum(crit_agreements) / len(crit_agreements), 1
    ) if crit_agreements else 0.0

    # Overall QWK: weighted average of per-criterion QWKs, weighted by
    # criterion weight. If QWK is unavailable for a criterion (undefined),
    # it is excluded from the weighted average.
    qwk_weighted_sum = 0.0
    qwk_weight_total = 0.0
    for cid in crit_ids:
        q = per_criterion_metrics[cid]["qwk"]
        if q is not None:
            w = float(crit_lookup[cid]["weight"])
            qwk_weighted_sum  += q * w
            qwk_weight_total  += w
    overall_qwk = (
        round(qwk_weighted_sum / qwk_weight_total, 4)
        if qwk_weight_total > 0 else None
    )

    # Mean confidence
    avg_confidence = _compute_mean_confidence(per_essay_results, rubric)

    return {
        "overall_agreement_pct": overall_agreement_pct,
        "overall_qwk":           overall_qwk,
        "per_criterion":         per_criterion_metrics,
        "avg_model_confidence":  avg_confidence,
        "per_essay_results":     per_essay_results,
        "metadata": {
            "rubric_path":      rubric_path,
            "labeled_path":     labeled_path,
            "model_name":       model_name,
            "temperature":      temperature,
            "n_essays_total":   total,
            "n_essays_scored":  total - n_failed,
            "n_essays_failed":  n_failed,
            "timestamp":        datetime.now(timezone.utc).isoformat(),
        },
    }


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------

def format_report(results: dict) -> str:
    """
    Render the evaluation results as a human-readable plain-text report
    with an essay-by-criterion table, a summary table, and interpretation.
    """
    meta  = results["metadata"]
    lines = []

    # ---- Header ----
    lines += [
        "",
        "=" * 72,
        "  Marginalia — Scoring Accuracy Evaluation Report",
        f"  Model:   {meta['model_name']}",
        f"  Rubric:  {os.path.basename(meta['rubric_path'])}",
        f"  Labeled: {os.path.basename(meta['labeled_path'])}",
        f"  Essays:  {meta['n_essays_scored']} scored / "
        f"{meta['n_essays_total']} total "
        f"({'all' if meta['n_essays_failed'] == 0 else str(meta['n_essays_failed']) + ' failed'})",
        f"  Run at:  {meta['timestamp']}",
        "=" * 72,
        "",
    ]

    # ---- Per-essay detail table ----
    lines.append(
        f"{'Essay':<12} {'Quality':<8} {'Criterion':<22} "
        f"{'Expert':>6} {'AI':>5} {'|Δ|':>4} {'≤1?':<6}"
    )
    lines.append("-" * 65)

    for essay_result in results["per_essay_results"]:
        eid     = essay_result["essay_id"]
        quality = essay_result.get("quality_band", "?")[:7]
        error   = essay_result.get("error")

        if error:
            lines.append(f"{eid:<12} {quality:<8} {'[FAILED]':<22} {error[:30]}")
            continue

        expert_scores = essay_result.get("expert_scores", {})
        ai_scores     = essay_result.get("ai_scores", {})

        first_row = True
        for cid, crit_ai in ai_scores.items():
            exp_score = expert_scores.get(cid, {}).get("score", "?")
            ai_score  = crit_ai.get("score", "?")
            delta     = abs(float(ai_score) - float(exp_score)) if isinstance(exp_score, (int, float)) else "?"
            within1   = "YES" if isinstance(delta, float) and delta <= 1.0 else ("NO" if isinstance(delta, float) else "?")

            crit_name = results["per_criterion"].get(cid, {}).get("name", cid)[:22]
            eid_col   = eid if first_row else ""
            qual_col  = quality if first_row else ""
            first_row = False

            delta_str = f"{delta:.1f}" if isinstance(delta, float) else str(delta)
            ai_str    = f"{float(ai_score):.1f}" if isinstance(ai_score, (int, float)) else str(ai_score)

            lines.append(
                f"{eid_col:<12} {qual_col:<8} {crit_name:<22} "
                f"{str(exp_score):>6} {ai_str:>5} {delta_str:>4} {within1:<6}"
            )

        # Overall score row
        overall_ai = essay_result.get("overall_ai_score")
        grade      = essay_result.get("overall_letter_grade", "")
        if overall_ai is not None:
            lines.append(
                f"{'':12} {'':8} {'  Overall':22} "
                f"{'':6} {overall_ai:5.1f} {'':4} {grade}"
            )
        lines.append("")

    # ---- Summary table ----
    lines += [
        "-" * 65,
        f"{'Criterion':<25} {'Agreement ≤1':>13} {'QWK':>8} {'n':>4}",
        "-" * 65,
    ]

    for cid, crit_m in results["per_criterion"].items():
        agree_str = f"{crit_m['agreement_pct']:.1f}%"
        qwk_val   = crit_m["qwk"]
        qwk_str   = f"{qwk_val:.3f}" if qwk_val is not None else " N/A"
        lines.append(
            f"{crit_m['name']:<25} {agree_str:>13} {qwk_str:>8} {crit_m['n_essays']:>4}"
        )

    lines.append("-" * 65)
    overall_qwk = results["overall_qwk"]
    overall_qwk_str = f"{overall_qwk:.3f}" if overall_qwk is not None else " N/A"
    lines.append(
        f"{'OVERALL (weighted)':<25} "
        f"{results['overall_agreement_pct']:>12.1f}% "
        f"{overall_qwk_str:>8}"
    )
    lines.append(f"Avg model confidence: {results['avg_model_confidence']:.2f}")
    lines.append("")

    # ---- Honest interpretation section ----
    agg = results["overall_agreement_pct"]
    qwk = results["overall_qwk"]
    qwk_str = f"{qwk:.3f}" if qwk is not None else "N/A"

    if agg >= 80:
        interp = (
            f"Agreement-within-1 is {agg:.1f}% — above the 80% threshold commonly "
            f"cited as acceptable for automated essay scoring in educational research."
        )
    else:
        interp = (
            f"Agreement-within-1 is {agg:.1f}% — below the 80% threshold commonly "
            f"cited for acceptable automated essay scoring. This is a real number, "
            f"not sugar-coated. Likely causes: (a) the 8-essay labeled set is too "
            f"small for stable estimates — expand to 15-20 essays; (b) rubric anchors "
            f"need to be tightened to reduce rater ambiguity; (c) prompt temperature "
            f"may be too high — try 0.1."
        )
    lines.append(textwrap.fill(interp, width=70))
    lines.append("")

    if qwk is not None:
        if qwk >= 0.8:
            qwk_interp = f"QWK = {qwk_str}: near-human agreement (> 0.80 threshold)."
        elif qwk >= 0.6:
            qwk_interp = f"QWK = {qwk_str}: substantial agreement (0.60–0.80 range, publication-quality for educational AI)."
        elif qwk >= 0.4:
            qwk_interp = f"QWK = {qwk_str}: moderate agreement (0.40–0.60). Acceptable baseline; tighten anchors for improvement."
        else:
            qwk_interp = f"QWK = {qwk_str}: poor agreement (< 0.40). Prompt design or rubric anchors need revision."
        lines.append(textwrap.fill(qwk_interp, width=70))
        lines.append("")

    # ---- Sample-size warning ----
    n_scored = meta["n_essays_scored"]
    lines += [
        "⚠ SAMPLE SIZE WARNING:",
        textwrap.fill(
            f"  QWK computed over {n_scored} essay/criterion pairs has high "
            f"variance — a single score disagreement can shift QWK by ±0.1 or "
            f"more. Do NOT quote QWK from this run in a final report or paper "
            f"without first expanding labeled_validation.json to 15–20 essays. "
            f"This is the standard recommendation in AES research "
            f"(Shermis & Burstein, 2013).",
            width=70,
            initial_indent="  ",
            subsequent_indent="  ",
        ),
        "",
        "Next steps if accuracy is below target:",
        "  1. Expand labeled_validation.json to 15–20 expert-scored essays.",
        "  2. Tighten rubric anchor snippets (more specific, shorter excerpts).",
        "  3. Reduce temperature to 0.1 for more deterministic scoring.",
        "  4. Add a second expert rater and use inter-rater agreement as",
        "     the ceiling — AI vs human agreement cannot exceed human vs human.",
        "",
        "=" * 72,
    ]

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# __main__ — CLI runner
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Evaluate Marginalia AI scoring accuracy against expert labels.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Metrics:
              agreement_within_1  Fraction of essay/criterion pairs where
                                  |AI score - expert score| <= 1.
                                  Target: >= 80%.

              QWK                 Quadratic Weighted Kappa -- the standard AES
                                  accuracy metric. Target: >= 0.70 (substantial).
                                  Reference: Shermis & Burstein (2013).

            NOTE: With the default 8-essay validation set, QWK has high variance.
            Expand labeled_validation.json to 15-20 essays before citing numbers.
        """),
    )
    parser.add_argument("--rubric",   default=_DEFAULT_RUBRIC_PATH,
                        help="Path to rubric JSON (default: data/default_rubric.json)")
    parser.add_argument("--labeled",  default=_DEFAULT_LABELED_PATH,
                        help="Path to labeled validation JSON")
    parser.add_argument("--model",    default="gemini-2.5-flash",
                        help="Gemini model name (default: gemini-2.5-flash)")
    parser.add_argument("--temp",     default=0.2, type=float,
                        help="Sampling temperature (default: 0.2)")
    parser.add_argument("--json-out", default=None,
                        help="Optional path to write raw results as JSON")
    parser.add_argument("--verbose",  action="store_true",
                        help="Print per-essay progress to stderr")
    args = parser.parse_args()

    print(f"\nRunning accuracy evaluation...", flush=True)
    print(f"  Rubric:  {args.rubric}")
    print(f"  Labeled: {args.labeled}")
    print(f"  Model:   {args.model}  (temperature={args.temp})")
    print()

    try:
        results = run_validation(
            rubric_path=args.rubric,
            labeled_path=args.labeled,
            model_name=args.model,
            temperature=args.temp,
            verbose=args.verbose,
        )
    except Exception as exc:
        sys.exit(f"[accuracy_eval] FATAL: {exc}")

    print(format_report(results))

    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as fh:
            json.dump(results, fh, indent=2, ensure_ascii=False, default=str)
        print(f"Raw results written to: {args.json_out}")