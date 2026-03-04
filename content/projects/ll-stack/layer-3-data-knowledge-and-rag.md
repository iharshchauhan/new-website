---
title: "Layer 3: Data, Knowledge, and RAG"
date: "2026-02-23"
description: "How to adapt base models with prompts, retrieval, embeddings, and tool calling."
category: "Frameworks"
tags: ["Framework", "RAG", "Prompting"]
---

# Layer 3: Data & Knowledge (Prompts, RAG, Tools)

**Core question**
How do I adapt a general LLM to my specific product, and how does it safely access real data?

If Layer 2 explains how models work, Layer 3 is where I make them useful.

This is the practical core of AI product work. It is where a general-purpose model becomes my assistant, my compliance co-pilot, my support helper, or my internal analyst.

I break this layer into three system components:

1. Prompt Architecture
2. Retrieval and Knowledge (RAG)
3. Tools and External Systems

---

# 3.1 Prompt Architecture and Fine-Tuning

## System View

At minimum, every LLM feature looks like this:

```
System Prompt
      |
User Input (Raw or Structured)
      |
Optional Context Injection
      |
LLM -> Structured Output
```

## Core Building Blocks

| Component         | What It Does                        | Why It Matters                  |
| ----------------- | ----------------------------------- | ------------------------------- |
| System prompt     | Sets role, tone, constraints        | Defines behavioral boundaries   |
| User prompt       | Captures user intent                | Translates UI into model input  |
| Few-shot examples | Demonstrates logic or style         | Improves consistency            |
| Structured output | JSON, schema, templates             | Makes output machine-readable   |
| Fine-tuning       | Updates model behavior via training | Improves repeatability at scale |

## How I Approach Prompt Design

Prompting is my first and cheapest lever. Before proposing fine-tuning, I:

* Define the exact role of the model
* Specify constraints explicitly
* Enforce structured outputs
* Create test cases that represent happy paths and edge cases

Only when the task is narrow, repeated at high volume, and requires strict consistency do I consider fine-tuning. Even then, I treat it as an optimization step, not the starting point.

## Decision Framework: Prompt vs Fine-Tune

| Scenario                                  | Best First Step |
| ----------------------------------------- | --------------- |
| Exploratory feature                       | Prompting       |
| Rapid iteration                           | Prompting       |
| Narrow repetitive classification          | Fine-tuning     |
| Brand-consistent tone at scale            | Fine-tuning     |
| Complex reasoning with external knowledge | RAG + Prompting |

As a PM, I ensure we do not jump to training when design can solve the problem.

---

# 3.2 Retrieval-Augmented Generation (RAG)

RAG is how I ground the model in product-specific knowledge.

## High-Level Architecture

```
            +----------------------+
            |   Knowledge Base     |
            | (Docs, Policies, KB) |
            +----------------------+
                       |
                Chunk + Embed
                       |
                Vector Database
                       ^
User Query -> Embed Query -> Similarity Search
                       |
               Retrieved Chunks
                       |
          Inject into Prompt as Context
                       |
                     LLM
```

## Core Components

| Component          | Function                      | Product Impact                       |
| ------------------ | ----------------------------- | ------------------------------------ |
| Embeddings         | Convert text to vectors       | Enables semantic search              |
| Chunking           | Split docs into segments      | Improves retrieval precision         |
| Metadata           | Tags, permissions, timestamps | Enables filtering and access control |
| Top-k retrieval    | Select most relevant chunks   | Controls cost and noise              |
| Context formatting | Structured injection          | Improves groundedness                |

## Design Decisions I Make

1. What content should be indexed?
2. How large should chunks be?
3. What metadata is necessary for filtering?
4. How many chunks are injected per query?
5. How do I expose sources to users for trust?

RAG is not just retrieval. It is knowledge architecture.

---

# 3.3 Tools and External Systems

RAG gives the model knowledge. Tools give it action.

## Tool-Enabled Architecture

```
User Query
    |
LLM (Tool-Aware)
    |
Tool Call (Structured Arguments)
    |
External System (DB / API)
    |
Tool Response
    |
LLM Final Response
```

## What Tools Enable

| Tool Type        | Example           | Why It Matters             |
| ---------------- | ----------------- | -------------------------- |
| Database queries | Fetch user record | Accurate state retrieval   |
| Workflow actions | Create ticket     | Operational automation     |
| Analytics        | Fetch metrics     | Reliable numbers           |
| External APIs    | CRM, payments     | Cross-system orchestration |

I use tools when the system must retrieve precise numbers, mutate state, or trigger actions. Models are good at reasoning. Databases are good at facts. Tools connect the two.

---

# RAG vs Tools vs Fine-Tuning

I use this mental model to decide the right adaptation mechanism:

| Need                                      | Best Approach |
| ----------------------------------------- | ------------- |
| Access private knowledge                  | RAG           |
| Access live structured data               | Tools         |
| Perform actions                           | Tools         |
| Improve tone or repetitive classification | Fine-tuning   |
| Rapid iteration and experimentation       | Prompting     |

Layer 3 is about choosing the right lever.

---

# Artifact I Produce for Layer 3

For any serious AI feature, I document:

1. Full system prompt and output schema
2. RAG architecture diagram and chunking strategy
3. Knowledge base schema with metadata fields
4. Tool definitions and access boundaries
5. A short note explaining why I chose RAG, tools, or fine-tuning

This documentation ensures the system is explainable, scalable, and evolvable.

Layer 3 is where differentiation happens. Infra and models set capability. Data and knowledge design determine whether the product feels generic or deeply integrated into real workflows.
