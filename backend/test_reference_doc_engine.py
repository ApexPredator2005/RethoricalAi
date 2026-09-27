"""
test_reference_doc_engine.py — Unit tests for reference_doc_engine.py using unittest.
"""

import unittest
from reference_doc_engine import (
    ingest_reference_document,
    chunk_document,
    build_chunk_index,
    retrieve_relevant_chunks,
    build_reference_grounded_prompt_direct,
    build_reference_grounded_prompt_chunked,
    generate_reference_grounded_feedback,
)


class TestReferenceDocEngine(unittest.TestCase):

    def setUp(self):
        self.sample_rubric = {
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

    def test_mode_autoselection_3000_word_boundary(self):
        # 1. Short document: 3000 words -> "direct"
        words_3000 = "word " * 3000
        doc_direct = ingest_reference_document(words_3000.encode("utf-8"), "text/plain")
        self.assertEqual(doc_direct["word_count"], 3000)
        self.assertEqual(doc_direct["mode"], "direct")

        # 2. Long document: 3001 words -> "chunked"
        words_3001 = "word " * 3001
        doc_chunked = ingest_reference_document(words_3001.encode("utf-8"), "text/plain")
        self.assertEqual(doc_chunked["word_count"], 3001)
        self.assertEqual(doc_chunked["mode"], "chunked")

        # 3. Small document
        words_50 = "This is a brief historical primary source excerpt."
        doc_small = ingest_reference_document(words_50.encode("utf-8"), "text/plain")
        self.assertEqual(doc_small["word_count"], 8)
        self.assertEqual(doc_small["mode"], "direct")

    def test_chunking_produces_expected_overlap(self):
        words = [f"token_{i}" for i in range(700)]
        full_text = " ".join(words)

        chunks = chunk_document(full_text, chunk_size_words=300, overlap_words=50)
        self.assertEqual(len(chunks), 3)

        self.assertEqual(chunks[0]["chunk_id"], 0)
        self.assertEqual(chunks[1]["chunk_id"], 1)
        self.assertEqual(chunks[2]["chunk_id"], 2)

        c0_words = chunks[0]["text"].split()
        c1_words = chunks[1]["text"].split()
        c2_words = chunks[2]["text"].split()

        self.assertEqual(len(c0_words), 300)
        self.assertEqual(len(c1_words), 300)
        self.assertEqual(len(c2_words), 200)

        # Overlap check
        self.assertEqual(c0_words[-50:], c1_words[:50])
        self.assertEqual(c1_words[-50:], c2_words[:50])

    def test_tfidf_retrieval_returns_correct_chunk(self):
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
        self.assertEqual(len(retrieved), 1)
        self.assertEqual(retrieved[0]["chunk_id"], 1)
        self.assertIn("Fitzgerald", retrieved[0]["text"])

    def test_chunked_mode_prompt_contains_absence_instruction(self):
        retrieved_chunks = [
            {"chunk_id": 0, "text": "He looked at her the way all women want to be looked at by a man."}
        ]
        essay_text = "Gatsby's devotion is evident in his silent gaze."

        prompt = build_reference_grounded_prompt_chunked(essay_text, retrieved_chunks, self.sample_rubric)

        expected_clause = (
            "You are only shown relevant excerpts, not the full source — "
            "do not assume something is absent from the source just because it's absent from these excerpts; "
            "only flag a claim as 'contradicted' if these excerpts directly contradict it, "
            "otherwise use 'unverified_against_source' rather than 'contradicted'."
        )
        self.assertIn(expected_clause, prompt)
        self.assertIn("=== RELEVANT SOURCE EXCERPTS (RETRIEVED SECTIONS) ===", prompt)
        self.assertIn("source_alignment", prompt)

    def test_direct_mode_prompt_builder(self):
        reference_text = "Nick Carraway observed Gatsby standing alone on the dark porch."
        essay_text = "Carraway serves as the moral anchor of West Egg."

        prompt = build_reference_grounded_prompt_direct(essay_text, reference_text, self.sample_rubric)

        self.assertIn("=== REFERENCE SOURCE DOCUMENT (COMPLETE TEXT) ===", prompt)
        self.assertIn(reference_text, prompt)
        self.assertIn("source_alignment", prompt)
        self.assertIn("unverified_against_source", prompt)

    def test_generate_reference_grounded_feedback_wrapper(self):
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
            rubric=self.sample_rubric,
            reference_doc=reference_doc_direct,
            ensemble=1
        )

        self.assertIn("source_alignment", res_direct)
        self.assertIn("source_alignment_note", res_direct)
        self.assertIn("full document", res_direct["source_alignment_note"])

        # Test chunked mode
        reference_doc_chunked = {
            "full_text": ("Paragraph about literary motifs in literature. " * 350),
            "word_count": 2100,
            "mode": "chunked"
        }
        res_chunked = generate_reference_grounded_feedback(
            essay_text=essay_text,
            segments=segments,
            rubric=self.sample_rubric,
            reference_doc=reference_doc_chunked,
            ensemble=1
        )

        self.assertIn("source_alignment", res_chunked)
        self.assertIn("source_alignment_note", res_chunked)
        self.assertIn("retrieved excerpts only", res_chunked["source_alignment_note"])


if __name__ == "__main__":
    unittest.main()
