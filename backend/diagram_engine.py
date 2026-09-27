"""
diagram_engine.py — Vision-based detection and structured analysis of diagrams,
charts, graphs, flowcharts, and geometric figures in uploaded answer-sheet images.

This module is invoked BEFORE or ALONGSIDE text OCR (preprocessing.py) whenever
a student uploads a photo or scan, not a plain-text paste. It uses Gemini's
multimodal vision API to understand visual content that text-only feedback
engines would silently ignore.

Typical pipeline position:
    image_bytes (scan/photo)
        ↓
    diagram_engine.evaluate_diagrams()        ← this module
        ↓  diagram_analysis: dict
    feedback_engine.build_scoring_prompt()    ← injected via diagram_analysis arg
        ↓  prompt (text + diagram summary)
    Gemini scoring model
        ↓
    FeedbackResult + diagram section in Streamlit report

Public API:
    detect_visual_regions(image_bytes) -> list[dict]
    analyze_diagram(image_bytes, region, expected_elements) -> dict
    evaluate_diagrams(image_bytes, expected_elements) -> dict

Integration notes (for future implementors):
─────────────────────────────────────────────────────────────────────
feedback_engine.build_scoring_prompt (Module 3):
    Accept an optional `diagram_analysis: dict` keyword argument.
    When present, append a plain-language summary block to the prompt:

        === VISUAL / DIAGRAM CONTENT ===
        {n} visual region(s) detected:
          [1] bar_chart (top-right quarter):
              Data trend: "Temperature increased steadily from 1990–2020."
              Completeness: "Y-axis units are missing."
              Coverage: 66.7% of expected elements found.
          ...

    Additionally, if any diagram has coverage_pct < 100% and the active
    rubric does NOT already have a "visual_accuracy" criterion, inject a
    synthetic rubric criterion:
        {
          "id": "visual_accuracy",
          "name": "Visual / Diagram Accuracy",
          "description": "Accuracy, completeness, and labelling of diagrams.",
          "weight": 0.20,          ← re-normalise other weights to sum to 1.0
          "scale_min": 1,
          "scale_max": 10,
          "anchors": {
            "low":  "Diagram is present but missing most required labels...",
            "mid":  "Diagram shows main trend but lacks axis units...",
            "high": "All required elements present and accurately labelled..."
          }
        }
    so diagram quality contributes to the weighted composite score.

Streamlit report page (Module 8 / app.py):
    Render a "Diagrams & Graphs" expander section ABOVE the essay body.
    For each detected region:
      - Show type badge (e.g. 🔵 bar_chart) + bounding_box_description
      - If PIL is available and crop coordinates are parseable, show thumbnail
      - completeness_notes (styled as a yellow advisory box)
      - coverage_pct progress bar (if expected_elements were given)
      - collapsed raw extracted_content JSON for teacher inspection
─────────────────────────────────────────────────────────────────────
"""

import base64
import json
import os
import re
import sys
import time
from typing import Optional

# ---------------------------------------------------------------------------
# Region type vocabulary
# ---------------------------------------------------------------------------

REGION_TYPES = frozenset({
    "bar_chart",
    "line_graph",
    "labeled_diagram",
    "flowchart",
    "geometric_figure",
    "table",
    "other",
})

# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------


class DiagramEngineError(RuntimeError):
    """
    Raised on unrecoverable Gemini Vision API or JSON-parsing failures after
    all retry attempts are exhausted.
    """


# ---------------------------------------------------------------------------
# Module-level Gemini model cache
# ---------------------------------------------------------------------------

_model_cache: dict = {}   # model_name → GenerativeModel


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _load_api_key() -> str:
    """Load GEMINI_API_KEY from .env (via python-dotenv) or environment."""
    try:
        from dotenv import load_dotenv
        load_dotenv(
            dotenv_path=os.path.join(
                os.path.dirname(os.path.abspath(__file__)), ".env"
            ),
            override=False,
        )
    except ImportError:
        pass
    return os.environ.get("GEMINI_API_KEY", "")


def _get_model(model_name: str, api_key: str):
    """
    Return a cached Gemini GenerativeModel. Initialise on first call.
    The diagram engine defaults to gemini-2.5-flash which supports vision.

    Raises:
        DiagramEngineError if google-generativeai is not installed or
        the API key is empty.
    """
    if model_name in _model_cache:
        return _model_cache[model_name]

    if not api_key:
        raise DiagramEngineError(
            "GEMINI_API_KEY is not set. "
            "Copy .env.example to .env and add your key."
        )

    try:
        import google.generativeai as genai
    except ImportError as exc:
        raise DiagramEngineError(
            "google-generativeai is not installed. "
            "Run: pip install google-generativeai"
        ) from exc

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name=model_name,
        system_instruction=(
            "You are an expert at reading student answer sheets. "
            "When asked to analyse visual content, you respond ONLY with "
            "the exact JSON requested — no markdown fences, no prose outside "
            "the JSON, no extra keys."
        ),
    )
    _model_cache[model_name] = model
    return model


def _detect_mime(image_bytes: bytes) -> str:
    """
    Infer MIME type from image magic bytes.

    Supports JPEG, PNG, WebP, GIF; defaults to image/jpeg for unknowns.
    Does not require Pillow — pure byte inspection.
    """
    if len(image_bytes) < 12:
        return "image/jpeg"
    if image_bytes[:4] == b"\x89PNG":
        return "image/png"
    if image_bytes[:2] == b"\xff\xd8":
        return "image/jpeg"
    if image_bytes[:4] == b"RIFF" and image_bytes[8:12] == b"WEBP":
        return "image/webp"
    if image_bytes[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    return "image/jpeg"  # safe fallback


def _image_content_part(image_bytes: bytes) -> dict:
    """
    Build a Gemini content part dict from raw image bytes using base64
    inline_data encoding. Does NOT require Pillow.
    """
    return {
        "inline_data": {
            "mime_type": _detect_mime(image_bytes),
            "data": base64.b64encode(image_bytes).decode("ascii"),
        }
    }


def _extract_json(raw_text: str, expect_array: bool = False) -> str:
    """
    Defensively extract a JSON object or array from *raw_text*.

    Handles:
      1. Markdown code fences  (```json ... ``` or ``` ... ```)
      2. Raw JSON starting partway through prose
      3. Leading/trailing whitespace

    Args:
        raw_text:     The raw string returned by the model.
        expect_array: If True, look for the outermost [...] instead of {...}.

    Returns:
        The extracted JSON string (not yet parsed).
    """
    # Strip fences first
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw_text)
    if fence_match:
        return fence_match.group(1).strip()

    if expect_array:
        start = raw_text.find("[")
        end = raw_text.rfind("]")
        if start != -1 and end > start:
            return raw_text[start : end + 1]
    else:
        start = raw_text.find("{")
        end = raw_text.rfind("}")
        if start != -1 and end > start:
            return raw_text[start : end + 1]

    return raw_text.strip()


def _call_vision_api(
    prompt: str,
    image_bytes: bytes,
    model_name: str = "gemini-2.5-flash",
    api_key: str = "",
) -> str:
    """
    Call the Gemini vision model with a text prompt and an image.

    This is the single point of contact with the external API. Isolated here
    so that tests can patch this function without touching Gemini internals.

    Args:
        prompt:      Text prompt to send alongside the image.
        image_bytes: Raw image bytes (JPEG, PNG, WebP, GIF).
        model_name:  Gemini model to use (must support vision).
        api_key:     Gemini API key (loaded from env if empty).

    Returns:
        Raw text response from the model.

    Raises:
        DiagramEngineError on API failure.
    """
    resolved_key = api_key or _load_api_key()
    model = _get_model(model_name, resolved_key)

    content_parts = [
        {"text": prompt},
        _image_content_part(image_bytes),
    ]

    try:
        response = model.generate_content(content_parts)
        return response.text
    except Exception as exc:
        raise DiagramEngineError(
            f"Gemini vision API call failed: {exc}"
        ) from exc


# ---------------------------------------------------------------------------
# Prompts
# ---------------------------------------------------------------------------

_DETECT_PROMPT = """\
You are examining a student answer sheet or exam page.

Task: Identify every distinct VISUAL REGION on this page that is NOT plain
paragraph text. Visual regions include but are not limited to:
  - Bar charts, column charts, histograms
  - Line graphs, scatter plots, curve diagrams
  - Labeled diagrams (e.g. biological cell, circuit diagram, water cycle)
  - Flowcharts, process diagrams, decision trees
  - Geometric figures (triangles, circles, coordinate plane drawings)
  - Tables with data (NOT plain text paragraphs)
  - Equations combined with accompanying figures

Return a JSON ARRAY. Each element must follow this exact schema:
{
  "region_id": <integer starting at 1>,
  "type": "<exactly one of: bar_chart | line_graph | labeled_diagram | flowchart | geometric_figure | table | other>",
  "bounding_box_description": "<rough position on the page, e.g. 'top-right quarter', 'centre of page', 'below the third paragraph'>",
  "raw_description": "<1–2 sentences describing exactly what is drawn>"
}

CRITICAL RULES:
  - If the page contains ONLY plain paragraph text (no diagrams, no charts,
    no tables, no geometric figures), return an EMPTY JSON ARRAY: []
  - Return ONLY the JSON array. No prose before or after it. No code fences.
  - Do NOT invent regions that are not visually present.
"""

_ANALYZE_PROMPT_TEMPLATE = """\
You are examining a student answer sheet. Focus ONLY on the following visual
region:

  Region ID:   {region_id}
  Type:        {type}
  Position:    {bounding_box_description}
  Description: {raw_description}

Extract a detailed structured reading of this {type}. Return ONLY the JSON
object below. Fill in each field that applies to this diagram type; set
fields that do NOT apply to null.

{expected_instruction}

JSON schema to return:
{{
  "region_id": {region_id},
  "type": "{type}",
  "extracted_content": {{
    "axes_labels": {{"x": "<x-axis label>", "y": "<y-axis label>"}} | null,
    "data_trend_summary": "<what the plotted data shows in plain English>" | null,
    "labels_present": ["<label1>", "<label2>", ...] | null,
    "legend_present": true | false | null,
    "flow_steps": ["<step 1>", "<step 2>", ...] | null,
    "geometric_properties": "<angle values, side lengths, key properties>" | null
  }},
  "completeness_notes": "<what is missing, unlabelled, or ambiguous; 'None' if fully complete>",
  "confidence": <float 0.0–1.0; 1.0 = very confident reading>{expected_fields}
}}

Return ONLY the JSON object. No markdown fences. No prose outside the JSON.
"""

_EXPECTED_INSTRUCTION = """\
Additionally, check whether EACH of the following expected elements is
visually present in the diagram:
{element_list}

Add these two fields to your JSON response:
  "expected_elements_found": {{"<element>": true | false, ...}},
  "coverage_pct": <float 0–100, the percentage of expected elements found>
"""


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def detect_visual_regions(
    image_bytes: bytes,
    model_name: str = "gemini-2.5-flash",
    api_key: str = "",
    max_retries: int = 1,
    retry_delay: float = 2.0,
) -> list[dict]:
    """
    Send the full page image to Gemini Vision and identify every distinct
    visual region that is NOT plain paragraph text.

    Handles diverse answer-sheet types — science lab reports with labeled
    diagrams, maths papers with geometric constructions, social-studies
    responses with bar charts or flowcharts, etc.

    Args:
        image_bytes:  Raw bytes of the full page image (JPEG, PNG, WebP, GIF).
        model_name:   Gemini model to use. Must support vision.
        api_key:      Gemini API key (loads from .env / env var if empty).
        max_retries:  Additional attempts on JSON parse failure (default: 1).
        retry_delay:  Seconds between retry attempts.

    Returns:
        A list of region dicts, each with:
            {
              "region_id":               int,
              "type":                    str,   # one of REGION_TYPES
              "bounding_box_description": str,
              "raw_description":         str,
            }
        Returns an EMPTY LIST if the page contains only plain text.

    Raises:
        DiagramEngineError: If all retry attempts fail or if the API key
                            is missing.
    """
    last_error: Exception | None = None

    for attempt in range(max_retries + 1):
        try:
            raw_text = _call_vision_api(
                prompt=_DETECT_PROMPT,
                image_bytes=image_bytes,
                model_name=model_name,
                api_key=api_key,
            )

            json_str = _extract_json(raw_text, expect_array=True)
            regions = json.loads(json_str)

            if not isinstance(regions, list):
                raise DiagramEngineError(
                    f"detect_visual_regions: expected JSON array, got "
                    f"{type(regions).__name__!r}.\nRaw: {raw_text[:300]}"
                )

            # Normalise and validate each region
            validated: list[dict] = []
            for i, region in enumerate(regions):
                if not isinstance(region, dict):
                    sys.stderr.write(
                        f"[diagram_engine] WARNING: Skipping non-dict region at "
                        f"index {i}: {region!r}\n"
                    )
                    continue

                # Clamp region_id to int; fill missing fields with defaults
                region["region_id"] = int(region.get("region_id", i + 1))

                # Normalise type to the controlled vocabulary
                raw_type = str(region.get("type", "other")).lower().strip()
                region["type"] = raw_type if raw_type in REGION_TYPES else "other"

                region.setdefault("bounding_box_description", "unknown position")
                region.setdefault("raw_description", "")

                validated.append(region)

            return validated

        except (json.JSONDecodeError, DiagramEngineError) as exc:
            last_error = exc
            if attempt < max_retries:
                sys.stderr.write(
                    f"[diagram_engine] WARNING: detect_visual_regions attempt "
                    f"{attempt + 1} failed: {exc}. Retrying in {retry_delay}s...\n"
                )
                time.sleep(retry_delay)
            else:
                raise DiagramEngineError(
                    f"detect_visual_regions failed after {max_retries + 1} "
                    f"attempt(s). Last error: {last_error}"
                ) from last_error

    return []  # unreachable; satisfies type checker


def analyze_diagram(
    image_bytes: bytes,
    region: dict,
    expected_elements: Optional[list] = None,
    model_name: str = "gemini-2.5-flash",
    api_key: str = "",
    max_retries: int = 1,
    retry_delay: float = 2.0,
) -> dict:
    """
    Perform a focused, structured analysis of one detected visual region.

    The full page image is sent again with a prompt that names the specific
    region (by its bounding_box_description and raw_description), avoiding
    the need for pixel-level cropping while still directing the model's
    attention.

    Args:
        image_bytes:       Raw bytes of the full page image.
        region:            A dict from detect_visual_regions() describing the
                           region to analyse.
        expected_elements: Optional list of element strings the diagram SHOULD
                           contain, e.g. ["evaporation arrow", "cloud label",
                           "precipitation label"]. When provided, the result
                           includes "expected_elements_found" and "coverage_pct".
                           Typically sourced from a rubric criterion's
                           model-answer description or a teacher's mark scheme.
        model_name:        Gemini model to use.
        api_key:           Gemini API key (loads from env if empty).
        max_retries:       Additional retry attempts on JSON parse failure.
        retry_delay:       Seconds between retries.

    Returns:
        A dict with:
            {
              "region_id":   int,
              "type":        str,
              "extracted_content": {
                  "axes_labels":           {"x": str, "y": str} | None,
                  "data_trend_summary":    str | None,
                  "labels_present":        list[str] | None,
                  "legend_present":        bool | None,
                  "flow_steps":            list[str] | None,
                  "geometric_properties":  str | None,
              },
              "completeness_notes": str,
              "confidence":         float,
              # Present only when expected_elements is provided:
              "expected_elements_found": {element: bool, ...},
              "coverage_pct":            float,    # 0.0–100.0
            }

    Raises:
        DiagramEngineError: If all retry attempts fail.
    """
    region_id  = region.get("region_id", 0)
    region_type = region.get("type", "other")
    bbox_desc  = region.get("bounding_box_description", "unknown position")
    raw_desc   = region.get("raw_description", "")

    # Build the expected-elements section of the prompt
    if expected_elements:
        element_list_str = "\n".join(f"  - {e}" for e in expected_elements)
        expected_instruction = _EXPECTED_INSTRUCTION.format(
            element_list=element_list_str
        )
        # Fields to add to the schema comment in the prompt
        expected_fields = (
            ',\n  "expected_elements_found": {<element>: true | false, ...},'
            '\n  "coverage_pct": <float 0–100>'
        )
    else:
        expected_instruction = ""
        expected_fields = ""

    prompt = _ANALYZE_PROMPT_TEMPLATE.format(
        region_id=region_id,
        type=region_type,
        bounding_box_description=bbox_desc,
        raw_description=raw_desc,
        expected_instruction=expected_instruction,
        expected_fields=expected_fields,
    )

    last_error: Exception | None = None

    for attempt in range(max_retries + 1):
        try:
            raw_text = _call_vision_api(
                prompt=prompt,
                image_bytes=image_bytes,
                model_name=model_name,
                api_key=api_key,
            )

            json_str = _extract_json(raw_text, expect_array=False)
            result = json.loads(json_str)

            if not isinstance(result, dict):
                raise DiagramEngineError(
                    f"analyze_diagram: expected JSON object, got "
                    f"{type(result).__name__!r}.\nRaw: {raw_text[:300]}"
                )

            # ---- Normalise and fill in defaults ----
            result["region_id"] = int(result.get("region_id", region_id))
            result["type"] = str(result.get("type", region_type))

            # Ensure extracted_content is a dict
            if not isinstance(result.get("extracted_content"), dict):
                result["extracted_content"] = {}

            ec = result["extracted_content"]
            for field in (
                "axes_labels", "data_trend_summary", "labels_present",
                "legend_present", "flow_steps", "geometric_properties",
            ):
                ec.setdefault(field, None)

            # Clamp confidence to [0, 1]
            raw_conf = result.get("confidence", 0.8)
            try:
                result["confidence"] = max(0.0, min(1.0, float(raw_conf)))
            except (TypeError, ValueError):
                result["confidence"] = 0.8

            result.setdefault("completeness_notes", "None")

            # ---- Compute coverage_pct from expected_elements_found ----
            if expected_elements:
                # Trust the model's expected_elements_found if valid
                found_map = result.get("expected_elements_found")
                if not isinstance(found_map, dict):
                    found_map = {}

                # Fill in any missing elements the model omitted
                for elem in expected_elements:
                    if elem not in found_map:
                        found_map[elem] = False

                # Ensure all values are bool
                found_map = {
                    k: bool(v) for k, v in found_map.items()
                    if k in expected_elements
                }
                result["expected_elements_found"] = found_map

                # Recompute coverage_pct from the map (don't trust model's arithmetic)
                n_found = sum(1 for v in found_map.values() if v)
                result["coverage_pct"] = round(
                    (n_found / len(expected_elements)) * 100.0, 1
                ) if expected_elements else 0.0

            return result

        except (json.JSONDecodeError, DiagramEngineError) as exc:
            last_error = exc
            if attempt < max_retries:
                sys.stderr.write(
                    f"[diagram_engine] WARNING: analyze_diagram attempt "
                    f"{attempt + 1} failed for region {region_id}: "
                    f"{exc}. Retrying in {retry_delay}s...\n"
                )
                time.sleep(retry_delay)
            else:
                raise DiagramEngineError(
                    f"analyze_diagram failed for region {region_id} after "
                    f"{max_retries + 1} attempt(s). Last error: {last_error}"
                ) from last_error

    # Unreachable but satisfies type checker
    raise DiagramEngineError("analyze_diagram: exhausted retries unexpectedly")


def evaluate_diagrams(
    image_bytes: bytes,
    expected_elements: Optional[list] = None,
    model_name: str = "gemini-2.5-flash",
    api_key: str = "",
    max_retries: int = 1,
) -> dict:
    """
    Convenience wrapper: detect all visual regions, then analyse each one.

    This is the function called from app.py immediately after image upload,
    before the text OCR / feedback pipeline runs.

    Args:
        image_bytes:       Raw bytes of the full uploaded page image.
        expected_elements: Optional list of expected diagram elements (applies
                           to ALL detected diagrams — if different diagrams
                           require different element sets, call analyze_diagram
                           individually with per-region expected_elements).
        model_name:        Gemini model (must support vision).
        api_key:           Gemini API key.
        max_retries:       Retry count passed through to both sub-functions.

    Returns:
        {
          "diagrams":                  [<analyze_diagram result>, ...],
          "diagram_count":             int,
          "overall_diagram_coverage_pct": float | None,
              # Mean coverage_pct across all diagrams, or None if no
              # expected_elements were given.
        }
    """
    regions = detect_visual_regions(
        image_bytes=image_bytes,
        model_name=model_name,
        api_key=api_key,
        max_retries=max_retries,
    )

    analyses: list[dict] = []
    for region in regions:
        try:
            analysis = analyze_diagram(
                image_bytes=image_bytes,
                region=region,
                expected_elements=expected_elements,
                model_name=model_name,
                api_key=api_key,
                max_retries=max_retries,
            )
            analyses.append(analysis)
        except DiagramEngineError as exc:
            # One failing region should not abort the whole evaluation.
            sys.stderr.write(
                f"[diagram_engine] WARNING: Could not analyze region "
                f"{region.get('region_id')}: {exc}\n"
            )
            # Insert a placeholder so callers can see the failure
            analyses.append({
                "region_id":         region.get("region_id"),
                "type":              region.get("type", "other"),
                "extracted_content": {},
                "completeness_notes": f"Analysis failed: {exc}",
                "confidence":        0.0,
                "error":             str(exc),
            })

    # Compute overall_diagram_coverage_pct
    if expected_elements:
        coverage_values = [
            a["coverage_pct"]
            for a in analyses
            if "coverage_pct" in a and isinstance(a["coverage_pct"], (int, float))
        ]
        overall_coverage = (
            round(sum(coverage_values) / len(coverage_values), 1)
            if coverage_values
            else 0.0
        )
    else:
        overall_coverage = None

    return {
        "diagrams":                     analyses,
        "diagram_count":                len(analyses),
        "overall_diagram_coverage_pct": overall_coverage,
    }