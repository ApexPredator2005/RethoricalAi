import pytest
from reference_doc_engine import (
    ingest_reference_document,
    chunk_document,
    build_chunk_index,
    retrieve_relevant_chunks,
    build_reference_grounded_prompt_direct,
    build_reference_grounded_prompt_chunked,
    generate_reference_grounded_feedback,
)
from rubric_engine import load_rubric


@pytest.fixture
def sample_rubric():
    return {
        "rubric_id": "test-rubric",
        "title": "Test Rubric",
        "scale_min": 1,
        "scale_max": 6,
        "criteria": [
            {
                "id": "thesis",
                "name": "Thesis & Argument",
                "description": "Clarity of thesis statement",
                "weight": 0.5,
                "scale_min": 1,
                "scale_max": 6,
                "anchors": {
                    "low": {"score": 2, "example": "Weak thesis"},
                    "mid": {"score": 4, "example": "Clear thesis"},
                    "high": {"score": 6, "example": "Nuanced thesis"}
                }
            },
            {
                "id": "evidence",
                "name": "Textual Evidence",
                "description": "Integration of quotes",
                "weight": 0.5,
                "scale_min": 1,
                "scale_max": 6,
                "anchors": {
                    "low": {"score": 2, "example": "Few quotes"},
                    "mid": {"score": 4, "example": "Good quotes"},
                    "high": {"score": 6, "example": "Seamless quotes"}
                }
            }
        ]
    }


def test_mode_autoselection_3000_word_boundary():
    # 1. Short document: 3000 words -> "direct"
    words_3000 = "word " * 3000
    doc_direct = ingest_reference_document(words_3000.encode("utf-8"), "text/plain")
    assert doc_direct["word_count"] == 3000
    assert doc_direct["mode"] == "direct"

    # 2. Long document: 3001 words -> "chunked"
    words_3001 = "word " * 3001
    doc_chunked = ingest_reference_document(words_3001.encode("utf-8"), "text/plain")
    assert doc_chunked["word_count"] == 3001
    assert doc_chunked["mode"] == "chunked"

    # 3. Small document
    words_50 = "This is a brief historical primary source excerpt."
    doc_small = ingest_reference_document(words_50.encode("utf-8"), "text/plain")
    assert doc_small["word_count"] == 8
    assert doc_small["mode"] == "direct"


def test_chunking_produces_expected_overlap():
    # Create text with 700 words: word_0, word_1, ... word_699
    words = [f"token_{i}" for i in range(700)]
    full_text = " ".join(words)

    # chunk_size=300, overlap=50 -> step = 250
    # chunk 0: words 0..299
    # chunk 1: words 250..549 (overlap 250..299)
    # chunk 2: words 500..699 (overlap 500..549)
    chunks = chunk_document(full_text, chunk_size_words=300, overlap_words=50)
    assert len(chunks) == 3

    assert chunks[0]["chunk_id"] == 0
    assert chunks[1]["chunk_id"] == 1
    assert chunks[2]["chunk_id"] == 2

    c0_words = chunks[0]["text"].split()
    c1_words = chunks[1]["text"].split()
    c2_words = chunks[2]["text"].split()

    assert len(c0_words) == 300
    assert len(c1_words) == 300
    assert len(c2_words) == 200

    # Overlap check
    assert c0_words[-50:] == c1_words[:50]
    assert c1_words[-50:] == c2_words[:50]


def test_tfidf_retrieval_returns_correct_chunk():
    # Create 3 distinct thematic chunks
    chunk_0 = "Astronomy and astrophysical stellar evolution in distant galaxies and supernovas."
    chunk_1 = "F. Scott Fitzgerald and Jay Gatsby in West Egg with Daisy Buchanan and green light."
    chunk_2 = "Marine biology and coral reef ecosystems in tropical oceanic thermal currents."

    chunks = [
        {"chunk_id": 0, "text": chunk_0},
        {"chunk_id": 1, "text": chunk_1},
        {"chunk_id": 2, "text": chunk_2}
    ]

    index = build_chunk_index(chunks)

    essay_text = "The symbolism of Gatsby staring at the green dock light reveals Daisy's emotional distance."
    segments = {"paragraphs": [essay_text]}

    retrieved = retrieve_relevant_chunks(essay_text, segments, index, chunks, top_k=1)
    assert len(retrieved) == 1
    assert retrieved[0]["chunk_id"] == 1
    assert "Fitzgerald" in retrieved[0]["text"]


def test_chunked_mode_prompt_contains_absence_instruction(sample_rubric):
    retrieved_chunks = [
        {"chunk_id": 0, "text": "He looked at her the way all women want to be looked at by a man."}
    ]
    essay_text = "Gatsby's devotion is evident in his silent gaze."

    prompt = build_reference_grounded_prompt_chunked(essay_text, retrieved_chunks, sample_rubric)

    # Mandatory constraint verification
    expected_clause = (
        "You are only shown relevant excerpts, not the full source — "
        "do not assume something is absent from the source just because it's absent from these excerpts; "
        "only flag a claim as 'contradicted' if these excerpts directly contradict it, "
        "otherwise use 'unverified_against_source' rather than 'contradicted'."
    )
    assert expected_clause in prompt
    assert "=== RELEVANT SOURCE EXCERPTS (RETRIEVED SECTIONS) ===" in prompt
    assert "source_alignment" in prompt


def test_direct_mode_prompt_builder(sample_rubric):
    reference_text = "Nick Carraway observed Gatsby standing alone on the dark porch."
    essay_text = "Carraway serves as the moral anchor of West Egg."

    prompt = build_reference_grounded_prompt_direct(essay_text, reference_text, sample_rubric)

    assert "=== REFERENCE SOURCE DOCUMENT (COMPLETE TEXT) ===" in prompt
    assert reference_text in prompt
    assert "source_alignment" in prompt
    assert "unverified_against_source" in prompt


def test_generate_reference_grounded_feedback_wrapper(sample_rubric):
    reference_doc_direct = {
        "full_text": "Short primary source text about Gatsby.",
        "word_count": 10,
        "mode": "direct"
    }
    essay_text = "Gatsby represents romantic idealism."
    segments = {"paragraphs": [essay_text]}

    res_direct = generate_reference_grounded_feedback(
        essay_text=essay_text,
        segments=segments,
        rubric=sample_rubric,
        reference_doc=reference_doc_direct,
        ensemble=1
    )

    assert "source_alignment" in res_direct
    assert "source_alignment_note" in res_direct
    assert "full document" in res_direct["source_alignment_note"]

    # Test chunked mode
    reference_doc_chunked = {
        "full_text": ("Paragraph about literary motifs in literature. " * 350),
        "word_count": 2100,
        "mode": "chunked"
    }
    res_chunked = generate_reference_grounded_feedback(
        essay_text=essay_text,
        segments=segments,
        rubric=sample_rubric,
        reference_doc=reference_doc_chunked,
        ensemble=1
    )

    assert "source_alignment" in res_chunked
    assert "source_alignment_note" in res_chunked
    assert "retrieved excerpts only" in res_chunked["source_alignment_note"]
