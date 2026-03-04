---
title: "Layer 2: Models and How They Differ"
date: "2026-02-22"
description: "A framework for understanding model behavior through pretraining, transformers, and alignment."
category: "Frameworks"
tags: ["Framework", "Models", "Transformers"]
---

# Layer 2: Models

**Core question**
What is an LLM under the hood, and why do different models behave differently?

Layer 2 is the conceptual backbone of every AI product I build. If I understand how models are trained, structured, and aligned, I can reason clearly about RAG, prompting, context limits, cost, and capability trade-offs.

I break this layer into three architectural components: Pretraining, Transformer Architecture, and Alignment.

---

# 2.1 Data & Pretraining

## Mental Model

At its core, a large language model is trained to predict the next token given previous tokens.

```
Massive Text Corpus -> Tokenization -> Next-Token Prediction Training -> Base Model
```

## What Shapes the Base Model

| Factor                   | What It Means               | Why It Matters to Me as a PM                   |
| ------------------------ | --------------------------- | ---------------------------------------------- |
| Pretraining corpus       | Web, books, code, docs      | Defines general knowledge and blind spots      |
| Self-supervised learning | Predict next token          | Explains why models autocomplete intelligently |
| Scale                    | Data + parameters + compute | Larger scale usually improves reasoning        |
| Training cut-off         | Knowledge frozen at date    | Model does not know recent or private info     |

## Product Implication

A base model has broad world knowledge. It does not know my company's policies, my users' data, or yesterday's events.

If my feature depends on fresh or private information, I must add it via RAG, fine-tuning, or tool integrations. Pretraining alone is never enough for product specificity.

---

# 2.2 Transformer Architecture

This is where capability and constraints become concrete.

## Simplified Architecture View

```
Input Text -> Tokenization -> Transformer Layers (Self-Attention) -> Output Tokens
```

## Key Concepts I Must Understand

| Concept              | What It Is                        | Product Impact                     |
| -------------------- | --------------------------------- | ---------------------------------- |
| Tokens               | Units of text the model processes | Pricing and limits are token-based |
| Self-attention       | Mechanism to weigh prior tokens   | Enables reasoning across context   |
| Multi-head attention | Parallel attention patterns       | Captures different relationships   |
| Context window       | Max tokens model can see          | Hard cap on prompt size            |
| Parameters           | Model size in billions            | Influences quality, cost, latency  |

## How This Shapes My Decisions

The context window is a hard constraint. I cannot dump entire documents into the prompt indefinitely. If I exceed limits, I must summarize or retrieve selectively.

Bigger models and longer context windows usually mean better reasoning but slower and more expensive inference. When I select a model, I am choosing a point on this curve:

| Smaller Model                     | Larger Model               |
| --------------------------------- | -------------------------- |
| Lower cost                        | Higher cost                |
| Lower latency                     | Higher latency             |
| Adequate reasoning                | Stronger reasoning         |
| Suitable for high-frequency tasks | Suitable for complex tasks |

Understanding this lets me design features that are economically viable and technically grounded.

---

# 2.3 Training & Alignment

After pretraining, models are not yet product ready.

## Training Pipeline View

```
Base Model -> Instruction Tuning -> Human or AI Feedback -> Aligned Model
```

## Components

| Stage                | Purpose                             | Product Impact                    |
| -------------------- | ----------------------------------- | --------------------------------- |
| Base model           | Raw next-token predictor            | Powerful but unpredictable tone   |
| Instruction tuning   | Learn to follow instructions        | Improves usefulness               |
| RLHF or RLAIF        | Optimize for helpfulness and safety | Shapes personality and guardrails |
| Model specialization | Code, chat, small-device, domain    | Determines feature fit            |

## Why Models Feel Different

Models differ because of:

* The data they were trained on
* The objectives used during training
* The aggressiveness of alignment policies

As a PM, this explains why one model feels cautious, another creative, another strong at code, and another optimized for speed.

When I choose a model for a feature, I match alignment style to product intent. A support assistant may need conservative safety behavior. A coding assistant may prioritize precision. A lightweight summarizer may prioritize speed.

---

# Model Selection Framework I Use

Before committing to a model, I evaluate it across four dimensions:

| Dimension  | Questions I Ask                                                      |
| ---------- | -------------------------------------------------------------------- |
| Capability | Does it handle our task complexity?                                  |
| Context    | Is the window sufficient for our workflows?                          |
| Cost       | Is it viable at projected usage scale?                               |
| Alignment  | Does its tone and safety profile match our brand and risk tolerance? |

This structured evaluation prevents model choice from being hype-driven.

---

# Artifact I Produce for Layer 2

For serious AI features, I document:

1. A short explanation of tokens, context window, and parameters
2. A comparison table of 2 to 4 candidate models
3. The reasoning behind final model selection
4. Known limitations tied to training cut-off and alignment

Layer 2 gives me mechanical sympathy for LLM systems. Once I understand how models are built and shaped, every other layer in the stack becomes easier to reason about and design responsibly.
