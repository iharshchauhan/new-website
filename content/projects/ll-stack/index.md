---
title: "LLM Stack: A Practical 5-Layer Map"
date: "2026-02-20"
description: "A practical framework for understanding AI systems across infrastructure, models, data, orchestration, and product."
category: "Frameworks"
tags: ["Framework", "LLM", "AI Systems"]
---

# LLM Stack: A Practical 5-Layer Map for Product Managers

When I build AI products, I do not think in terms of hype or model names. I think in layers. Over time, I have found that most LLM systems can be understood through five practical layers. This structure helps me decide where to go deep, where to stay conceptual, and how to connect technical decisions back to product outcomes.

This page is a short map. Each layer has its own subpage where I go deeper.

The five layers are:

| # | Layer Name           | What it covers                                                                                      | Sub-layers                                                                                  |
|---|----------------------|-----------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| 1 | **Infra**            | Physical and cloud infrastructure needed to train and run LLMs                                      | Hardware & Infra (1)                                                  |
| 2 | **Models**           | How LLMs are built and aligned before being used in products                                        | Data & Pretraining (2), Transformer Architecture (3), Training & Alignment (4) |
| 3 | **Data & Knowledge** | How models are adapted to a product and connected to data (prompts, RAG, tools, APIs, DBs)          | Adaptation via Prompts & Fine-tuning (5), Knowledge & Tools / RAG (6) |
| 4 | **Orchestration**    | How all components run together in production, including workflows, agents, evals, and safety       | Workflows/Chains (7), Single & Multi-Agent Systems (8, 9), Evals & Safety & Governance (10) |
| 5 | **App / Product**    | The actual product: UX, JTBD, interaction patterns, pricing, adoption, and feedback loops           | Product Layer – UX & Business (11)                                    |

---

---

## Layer 1: Infra

This layer answers a simple question: what does it cost to run this intelligence?

Here I think about GPUs, inference vs training, latency, throughput, and cost per request. As a PM, I do not need to understand CUDA kernels, but I do need to reason about trade-offs. If I increase context size, latency increases. If I call the largest model for every interaction, margin disappears.

Infra shapes product constraints. It determines whether a feature feels instant or slow, cheap or premium, scalable or fragile.

---

## Layer 2: Models

This is the conceptual backbone.

I make sure I understand tokens, context windows, transformers, alignment, and why different model families behave differently. A base model has general knowledge, not my product knowledge. Alignment tuning explains tone and safety behavior. Context windows explain why I cannot just "paste everything" into a prompt.

When I choose a model, I am choosing trade-offs between quality, cost, latency, and control.

---

## Layer 3: Data & Knowledge

This is where real product differentiation happens.

Here I design prompts, define structured outputs, connect RAG pipelines, and wire tools to APIs or databases. This is how a generic LLM becomes my product's assistant. I decide what knowledge is injected, how documents are chunked, how embeddings are stored, and how retrieval works.

If the product needs to reason over internal policies, user data, or recent events, this layer is the bridge. In my experience, most practical AI work for PMs lives here.

---

## Layer 4: Orchestration

This layer is about how everything runs together in production.

I define workflows such as classify -> retrieve -> generate -> validate -> respond. I decide when a simple chain is enough and when an agent loop is justified. I also think about evaluation, logging, safety filters, and fallback paths.

Orchestration turns isolated prompts into reliable systems. Without it, AI features feel impressive in demos but brittle in production.

---

## Layer 5: App / Product

This is the layer users actually see.

Here I define the job to be done, the persona, the interaction pattern, and the success metrics. Is the AI a chat assistant, a background copilot, a structured form enhancer, or a decision helper? Where does the human review output? How do we measure value created?

Every lower layer should justify itself through this one. If infra, models, data, and orchestration choices do not clearly improve user outcomes, they are over-engineering.

---

## How I Use This Stack

I usually learn and design in this order:

I build a strong intuition for models. I go deep on data and RAG because that is where product leverage lives. I wrap it in a clear product story with defined metrics. Then I add orchestration and evaluation to make it production ready. Infra stays as a constraint lens throughout.

This five-layer map keeps AI systems grounded for me. It helps me move from curiosity to shipping, without getting lost in unnecessary depth.
