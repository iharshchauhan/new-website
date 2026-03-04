---
title: "5 Chunking Strategies for RAG: A Technical AI PM Playbook"
date: "2026-03-04"
description: "I break down fixed-size, semantic, recursive, structure-based, and LLM chunking through a product lens and share how we should choose in production."
category: "Proof of work"
tags: ["RAG", "LLMs", "Retrieval", "Proof Of Work"]
---

I used Avi Chawla's article [5 Chunking Strategies For RAG](https://blog.dailydoseofds.com/p/5-chunking-strategies-for-rag) as the base and rewrote it from a delivery perspective. My goal here is not to list definitions. I want us to decide faster, ship faster, and improve retrieval quality with fewer cycles.

![RAG chunking overview](/images/articles/rag-chunking/6878b8fa-5e74-45a1-9a89-5aab92889126_2366x990.gif)

## Why I treat chunking as a product decision

When we design a RAG system, chunking is one of the highest leverage choices we make early. It changes what gets retrieved, how much irrelevant text gets pulled in, and how grounded the final answer feels. If chunking is weak, no amount of prompt polishing can save the user experience.

I usually frame chunking as a three-way tradeoff between quality, speed, and cost. The strategy we pick should match the business surface we are building for. A low-risk internal search assistant can tolerate simpler chunking. A customer-facing copilot that must cite policy text cannot.

## Fixed-size chunking

Fixed-size chunking is where I start when we need a baseline quickly. We split text into equal windows and keep slight overlap for continuity.

![Fixed-size chunking](/images/articles/rag-chunking/deab4ef3-d3ec-4459-8004-ceffe81652ca_1829x392.png)

This gives predictable indexing time and easy scaling, which is useful during early prototyping. The downside is clear: boundaries are artificial, so a key concept can get cut in half. In practice, this often hurts precision because the retrieved chunk contains partial context.

For a first pass, I keep chunk size around 400 to 800 tokens and overlap near 10 to 20 percent.

## Semantic chunking

Semantic chunking starts from natural units like sentences or paragraphs, then groups neighboring units when they are semantically close.

![Semantic chunking](/images/articles/rag-chunking/92c70184-ba0f-4877-9a55-e4add0e311ad_870x1116.gif)

I use this when coherence matters more than ingestion speed. It is especially useful for policies, technical docs, and knowledge bases where ideas are dense and boundary errors are expensive. The major challenge is threshold tuning. If we merge too aggressively, chunks become noisy. If we are too strict, we fragment context and hurt recall.

When we run semantic chunking, I prefer to tune on retrieval metrics, not gut feel.

## Recursive chunking

Recursive chunking is my default production baseline for mixed corpora. We split by high-level separators first and keep splitting only oversized pieces until we fit token constraints.

![Recursive chunking](/images/articles/rag-chunking/a6ad83a6-2879-4c77-9e49-393f16577aef_1066x288.gif)

It gives us a balanced middle ground. We preserve more structure than fixed windows while avoiding the full complexity of semantic chunking everywhere. This strategy is robust when documents vary in format and length.

In delivery terms, recursive chunking gives a strong quality-to-effort ratio and is usually the fastest way for us to get stable retrieval behavior.

## Structure-based chunking

Structure-based chunking follows explicit document hierarchy such as headings, sections, and tables.

![Structure-based chunking](/images/articles/rag-chunking/f4009caa-34fc-48d6-8102-3d0f6f2c1386_1066x316.gif)

I prefer this for handbooks, SOPs, legal docs, and product specs because it improves explainability. When users ask where an answer came from, section-level context is easier to trace and defend. The limitation is that real corpora are messy. If structure is inconsistent, we need a fallback layer, typically recursive splitting.

## LLM-based chunking

LLM-based chunking asks a model to define semantically complete units directly.

![LLM-based chunking](/images/articles/rag-chunking/e8febecd-ee68-42ff-ab06-41a0a3a43cd3_1102x306.gif)

Quality can be excellent, especially for nuanced content with topic shifts that rule-based methods miss. I reserve this for high-value subsets because latency and cost grow quickly at ingestion scale. From a PM standpoint, I scope this deliberately to critical domains rather than defaulting the full corpus to it.

## How we should choose in production

![Strategy comparison frame](/images/articles/rag-chunking/40bdaf3b-601d-4357-bc7f-89b47f812097_1025x663.png)

If we want a practical path, I recommend we start with recursive chunking plus lightweight overlap, then add structure awareness where document formatting is reliable. If we still see precision issues after retrieval tuning, we introduce semantic chunking for specific document classes. LLM chunking should be a targeted investment for the highest-risk knowledge surfaces.

That sequence keeps effort proportional to impact and avoids overengineering too early.

## My rollout approach

When I run this in a roadmap, I phase it.

Phase one is baseline reliability: recursive chunking, metadata capture, and retrieval instrumentation.

Phase two is quality uplift: structure-aware boundaries for clean docs and selective semantic chunking for noisy domains.

Phase three is premium quality: LLM-based chunking only for the segments where wrong answers are most costly.

This staged plan lets us prove value with measurable gains instead of arguing architecture in the abstract.

## What I track

I evaluate chunking through retrieval and groundedness outcomes. I monitor Recall@k, ranking quality, and citation fidelity in final answers. If generation quality drops, I inspect chunk boundaries before changing the model.

That discipline prevents us from solving the wrong layer of the stack.

## Closing

There is no universally best chunking strategy. The right choice depends on corpus shape, latency budget, and answer risk. My recommendation is to treat chunking as a product lever, instrument it from day one, and evolve it in phases as we learn from real user queries.
