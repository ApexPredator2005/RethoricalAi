"""
rubric_engine.py — Rubric loading, validation, weighted scoring, and prompt serialisation.

All functions are stateless and side-effect free (except save_rubric and load_rubric
which do I/O). Rubric state lives in the caller (app.py session_state or accuracy_eval).
"""

import json
import os
import math


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------

class RubricValidationError(ValueError):
    """
    Raised by validate_rubric() when the rubric dict violates the schema.
    The message names the specific failing field and the offending value.
    """


# ---------------------------------------------------------------------------
# Grade-band table  (composite 0-100 → letter grade + status label)
# ---------------------------------------------------------------------------

_GRADE_BANDS: list[tuple[float, str, str]] = [
    (93.0, "A",   "Exemplary / Advanced"),
    (85.0, "A-",  "Proficient / Advanced"),
    (78.0, "B+",  "Proficient"),
    (70.0, "B",   "Approaching Proficiency"),
    (62.0, "C",   "Developing"),
    (55.0, "C-",  "Beginning"),
    (0.0,  "D/F", "Needs Significant Revision"),
]


# ---------------------------------------------------------------------------
# Default rubric path
# ---------------------------------------------------------------------------

_DEFAULT_RUBRIC_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "data", "default_rubric.json"
)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def load_rubric(path: str | None = None) -> dict:
    """
    Load a rubric from *path* (or the default rubric if *path* is None),
    validate it against the schema, and return the validated dict.

    Args:
        path: Absolute or relative path to a rubric JSON file.
              Defaults to data/default_rubric.json relative to this module.

    Returns:
        Validated rubric dict.

    Raises:
        FileNotFoundError: If the file does not exist.
        json.JSONDecodeError: If the file is not valid JSON.
        RubricValidationError: If the rubric violates the schema.
    """
    resolved = path or _DEFAULT_RUBRIC_PATH
    with open(resolved, "r", encoding="utf-8-sig") as fh:
        rubric = json.load(fh)
    validate_rubric(rubric)
    return rubric


def validate_rubric(rubric: dict) -> None:
    """
    Assert that *rubric* matches the required schema. Raises
    RubricValidationError with a descriptive message on the first violation.

    Schema rules:
        - Top-level key ``"criteria"`` must be a non-empty list.
        - Each criterion must have:
            id          (non-empty str)
            name        (non-empty str)
            description (non-empty str)
            weight      (float, 0 < weight <= 1)
            scale_min   (int >= 1)
            scale_max   (int > scale_min)
            anchors     (dict with non-empty str values for keys
                         "low", "mid", "high")
        - Sum of all criterion weights == 1.0  (tolerance ±0.002)
    """
    if not isinstance(rubric, dict):
        raise RubricValidationError(f"Rubric must be a dict, got {type(rubric).__name__!r}")

    criteria = rubric.get("criteria")
    if not criteria or not isinstance(criteria, list):
        raise RubricValidationError(
            '"criteria" must be a non-empty list; '
            f'got {type(criteria).__name__!r}'
        )

    required_keys = {"id", "name", "description", "weight", "scale_min", "scale_max", "anchors"}
    total_weight = 0.0

    for i, crit in enumerate(criteria):
        prefix = f"criteria[{i}]"

        # Required keys present
        missing = required_keys - set(crit.keys())
        if missing:
            raise RubricValidationError(f"{prefix} is missing required keys: {missing!r}")

        # id / name / description must be non-empty strings
        for field in ("id", "name", "description"):
            if not isinstance(crit[field], str) or not crit[field].strip():
                raise RubricValidationError(
                    f"{prefix}.{field!r} must be a non-empty string; "
                    f"got {crit[field]!r}"
                )

        # weight: (0, 1]
        w = crit["weight"]
        if not isinstance(w, (int, float)) or not (0 < w <= 1):
            raise RubricValidationError(
                f"{prefix}.weight must be a float in (0, 1]; got {w!r}"
            )
        total_weight += float(w)

        # scale_min / scale_max
        smin = crit["scale_min"]
        smax = crit["scale_max"]
        if not isinstance(smin, int) or smin < 1:
            raise RubricValidationError(
                f"{prefix}.scale_min must be an int >= 1; got {smin!r}"
            )
        if not isinstance(smax, int) or smax <= smin:
            raise RubricValidationError(
                f"{prefix}.scale_max must be an int > scale_min ({smin}); got {smax!r}"
            )

        # anchors
        anchors = crit["anchors"]
        if not isinstance(anchors, dict):
            raise RubricValidationError(f"{prefix}.anchors must be a dict; got {type(anchors).__name__!r}")
        for band in ("low", "mid", "high"):
            val = anchors.get(band)
            if not isinstance(val, str) or not val.strip():
                raise RubricValidationError(
                    f"{prefix}.anchors[{band!r}] must be a non-empty string; got {val!r}"
                )

    # Weight sum check  (allow ±0.002 for float rounding across many criteria)
    if not math.isclose(total_weight, 1.0, abs_tol=0.002):
        raise RubricValidationError(
            f"Criterion weights must sum to 1.0 (±0.002); current sum = {total_weight:.4f}"
        )


def save_rubric(rubric: dict, path: str) -> None:
    """
    Validate *rubric*, then serialise it to *path* as formatted JSON.

    Creates parent directories if they do not exist. Uses ensure_ascii=False
    so non-ASCII characters in descriptions are preserved.

    Raises:
        RubricValidationError: If the rubric fails validation before saving.
        OSError: On I/O errors.
    """
    validate_rubric(rubric)
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(rubric, fh, indent=2, ensure_ascii=False)


def compute_weighted_score(
    criterion_scores: list[dict],
    rubric: dict,
) -> float:
    """
    Compute a weighted composite score (0–100) from per-criterion raw scores.

    Each criterion score is first linearly normalised to [0, 1] based on its
    rubric scale, then multiplied by the criterion weight, then summed and
    scaled to 100.

    Formula (per criterion i):
        normalised_i = (score_i - scale_min_i) / (scale_max_i - scale_min_i)
        composite    = sum(normalised_i * weight_i) * 100

    Args:
        criterion_scores: List of dicts with keys ``"criterion_id"`` and
                          ``"score"`` (raw score on the rubric scale).
                          Accepted with either key name ``"criterion_id"`` or
                          the criterion ``"id"`` directly.
        rubric: Validated rubric dict (from load_rubric).

    Returns:
        Float in [0.0, 100.0].

    Raises:
        KeyError: If a criterion_id in scores is not found in the rubric.
    """
    # Build lookup dict: criterion_id → criterion dict
    crit_lookup = {c["id"]: c for c in rubric["criteria"]}

    total = 0.0
    for entry in criterion_scores:
        # Accept both "criterion_id" and "id" as the key name
        cid = entry.get("criterion_id") or entry.get("id")
        score = float(entry["score"])
        crit = crit_lookup[cid]
        smin = float(crit["scale_min"])
        smax = float(crit["scale_max"])
        weight = float(crit["weight"])

        # Clamp to valid range before normalising
        score = max(smin, min(smax, score))
        normalised = (score - smin) / (smax - smin)
        total += normalised * weight

    return round(total * 100, 2)


def score_to_letter_grade(composite_score: float) -> tuple[str, str]:
    """
    Map a 0–100 composite score to a (letter_grade, status_label) tuple.

    Grade bands:
        93–100  → ("A",   "Exemplary / Advanced")
        85–92   → ("A-",  "Proficient / Advanced")
        78–84   → ("B+",  "Proficient")
        70–77   → ("B",   "Approaching Proficiency")
        62–69   → ("C",   "Developing")
        55–61   → ("C-",  "Beginning")
         0–54   → ("D/F", "Needs Significant Revision")
    """
    for threshold, letter, label in _GRADE_BANDS:
        if composite_score >= threshold:
            return letter, label
    return "D/F", "Needs Significant Revision"


def serialise_rubric_for_prompt(rubric: dict) -> str:
    """
    Render the rubric as a compact, human-readable text block for injection
    into a Gemini prompt.

    Each criterion is formatted as::

        [N] Criterion Name  (weight: XX%, scale: min–max)
        Description: ...
        Scoring anchors (use these to calibrate your score):
          LOW  (~min to low_hi):  "<anchor text>"
          MID  (~mid_lo to mid_hi): "<anchor text>"
          HIGH (~hi_lo to max):   "<anchor text>"

    The anchor boundaries are approximate thirds of the scale, intended only
    to give the model a spatial sense of where LOW/MID/HIGH sit — the anchor
    *text* is the primary calibration signal.

    Returns:
        Multi-line string ready for f-string injection.
    """
    lines = ["=== GRADING RUBRIC ===", ""]

    for i, crit in enumerate(rubric["criteria"], 1):
        smin = crit["scale_min"]
        smax = crit["scale_max"]
        span = smax - smin
        low_hi  = smin + round(span / 3)
        mid_lo  = low_hi + 1
        mid_hi  = smin + round(2 * span / 3)
        hi_lo   = mid_hi + 1

        lines.append(
            f"[{i}] {crit['name']}  "
            f"(weight: {int(crit['weight']*100)}%, scale: {smin}–{smax})"
        )
        lines.append(f"    Description: {crit['description']}")
        lines.append("    Scoring anchors (calibrate your score against these):")
        lines.append(f'      LOW  (score {smin}–{low_hi}):  "{crit["anchors"]["low"]}"')
        lines.append(f'      MID  (score {mid_lo}–{mid_hi}): "{crit["anchors"]["mid"]}"')
        lines.append(f'      HIGH (score {hi_lo}–{smax}):  "{crit["anchors"]["high"]}"')
        lines.append("")

    return "\n".join(lines)