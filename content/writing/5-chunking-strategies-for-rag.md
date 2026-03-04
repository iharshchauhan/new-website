---
title: "5 Chunking Strategies for RAG (Enhanced Notes)"
date: "2026-03-04"
description: "A practical, production-oriented breakdown of fixed-size, semantic, recursive, structure-based, and LLM-based chunking for RAG."
category: "Proof of work"
tags: ["RAG", "LLMs", "Retrieval", "Proof Of Work"]
---

Source article: [5 Chunking Strategies For RAG](https://blog.dailydoseofds.com/p/5-chunking-strategies-for-rag) by Avi Chawla.

This version keeps the original ideas and adds a practical selection guide, implementation defaults, and evaluation checklist for production RAG systems.

![RAG chunking overview](/images/articles/rag-chunking/6878b8fa-5e74-45a1-9a89-5aab92889126_2366x990.gif)

## Why chunking matters

In a RAG pipeline, chunking is not only a token-limit workaround. It directly affects:

1. Retrieval precision (how often the right evidence is found)
2. Retrieval recall (how often all needed evidence is found)
3. Latency and index size
4. Answer grounding quality

If chunking is poor, even a strong retriever and model will hallucinate more often.

## 1) Fixed-size chunking

Split text by a fixed token/word/character length, usually with overlap.

![Fixed-size chunking](/images/articles/rag-chunking/deab4ef3-d3ec-4459-8004-ceffe81652ca_1829x392.png)

When to use:
- High-volume ingestion where speed and simplicity matter most
- Homogeneous documents with similar writing style

Pros:
- Fastest and easiest to implement
- Predictable chunk count and storage footprint

Cons:
- Breaks semantic boundaries
- Can split key facts across chunks

Practical default:
- `chunk_size: 400-800 tokens`, `overlap: 10-20%`

## 2) Semantic chunking

Start with natural segments (sentence/paragraph), compute embeddings, and merge adjacent segments while semantic similarity stays high.

![Semantic chunking](/images/articles/rag-chunking/92c70184-ba0f-4877-9a55-e4add0e311ad_870x1116.gif)

When to use:
- Knowledge-heavy content where preserving idea boundaries is critical
- Documentation, policies, research notes

Pros:
- Better semantic coherence
- Often improves retrieval quality over fixed-size chunking

Cons:
- Threshold tuning is data-dependent
- More compute and implementation complexity

Practical default:
- Start with paragraph units and cosine threshold around `0.75-0.85`, then tune by eval.

## 3) Recursive chunking

Split by major separators first, then recursively split oversized chunks until they fit token constraints.

![Recursive chunking](/images/articles/rag-chunking/a6ad83a6-2879-4c77-9e49-393f16577aef_1066x288.gif)

When to use:
- Mixed document lengths with variable section sizes
- Teams that need a robust baseline before semantic/LLM chunking

Pros:
- Keeps more structure than fixed-size chunking
- Handles long sections gracefully

Cons:
- More processing overhead than fixed-size
- Separator choice influences quality

Practical default:
- Separator order: `["\n\n", "\n", ". ", " "]`
- Max chunk size: `600-1000 tokens`

## 4) Document structure-based chunking

Use explicit document structure (headings, sections, paragraphs, tables) as chunk boundaries.

![Structure-based chunking](/images/articles/rag-chunking/f4009caa-34fc-48d6-8102-3d0f6f2c1386_1066x316.gif)

When to use:
- Well-formatted docs: manuals, specs, SOPs, legal docs

Pros:
- Preserves logical hierarchy and context
- Great for explainability and citation tracing

Cons:
- Fails on poorly structured docs
- Chunk lengths can be inconsistent

Practical default:
- Pair with recursive fallback for oversized sections.

## 5) LLM-based chunking

Prompt an LLM to segment text into semantically self-contained units.

![LLM-based chunking](/images/articles/rag-chunking/e8febecd-ee68-42ff-ab06-41a0a3a43cd3_1102x306.gif)

When to use:
- High-value corpora where quality matters more than indexing cost
- Complex narrative or multi-topic text

Pros:
- Strong semantic boundary detection
- Can handle nuanced context shifts

Cons:
- Highest cost and latency
- Potential chunking variance across runs/prompts

Practical default:
- Use only for top-priority document classes, not the entire corpus.

## Strategy selection cheat sheet

![Strategy comparison frame](/images/articles/rag-chunking/40bdaf3b-601d-4357-bc7f-89b47f812097_1025x663.png)

Use this decision order:

1. Start with recursive chunking as baseline.
2. Add structure-aware boundaries when documents are cleanly formatted.
3. Switch to semantic chunking if recall is fine but precision is weak.
4. Use LLM chunking for high-value subsets where error cost is high.

## Recommended hybrid for production

For most real-world RAG systems, a hybrid pipeline is strongest:

1. Parse document structure (headings/sections/tables).
2. Apply recursive splitting to enforce hard token ceilings.
3. Add light overlap (`10-15%`) for context continuity.
4. Attach metadata per chunk: `doc_id`, `section_path`, `page`, `timestamp`.
5. Re-rank retrieved chunks before final generation.

## Evaluation checklist

Track chunking quality with retrieval-first metrics:

- `Recall@k` for gold evidence chunks
- `MRR / nDCG` for ranking quality
- Context precision (irrelevant tokens inside retrieved chunks)
- End-answer groundedness (citation correctness)

If answer quality drops, inspect chunk boundaries before changing the LLM.

## Closing note

There is no universal winner across all corpora. Chunking should be treated as an optimization layer that is tuned by retrieval evaluation, not intuition.
