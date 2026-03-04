---
title: "Layer 1: Infra for LLM Products"
date: "2026-02-21"
description: "The infrastructure constraints behind LLM products: latency, cost, capacity, and reliability."
category: "Frameworks"
tags: ["Framework", "Infra", "LLM"]
---

# Layer 1: Infra

**Core question**
What physical and cloud infrastructure powers LLM systems, and how do those constraints shape my product decisions?

---

## 1. How I Frame Infra as a Tech AI PM

When I design an AI feature, infrastructure is not background noise. It is the boundary condition around every product decision I make.

I might want instant responses, deep reasoning, and unlimited usage. Infra determines what is feasible, what is affordable, and what is reliable.

I treat Layer 1 as a constraint model for the product.

---

## 2. High-Level Architecture View

At a simplified level, most LLM product infra looks like this:

```
User -> API Layer -> Orchestration Service -> Model Endpoint (GPU) -> Response
                         |
                    Logging / Metrics
                         |
                    Billing / Cost Tracking
```

Under the hood:

* Model endpoints run on GPU or TPU backed infrastructure.
* Requests are distributed across clusters.
* Rate limits and quotas protect capacity.
* Observability pipelines track latency, failures, and cost.

Even if I do not provision clusters myself, every box in this diagram affects my roadmap decisions.

---

## 3. Training vs Inference

This is the first conceptual split I make.

| Dimension    | Training                             | Inference                            |
| ------------ | ------------------------------------ | ------------------------------------ |
| Purpose      | Create or update a model             | Generate outputs for user requests   |
| Frequency    | Rare, large scale                    | Continuous, per user interaction     |
| Cost profile | Extremely high but episodic          | Metered and recurring                |
| PM impact    | Strategic model capability decisions | Daily UX, cost, and margin decisions |

As a product manager, most of my real trade-offs happen at inference time. Every prompt is a billable event. Every additional token increases cost and latency.

---

## 4. Core Infra Constraints That Shape Product

I reduce infra complexity into four levers.

### 1. Latency

Latency defines experience. If a feature responds in under a second, it feels fluid. At three seconds, users wait but tolerate it. Beyond that, I must redesign the interaction pattern.

This affects decisions such as:

* Do I stream tokens to mask latency?
* Should this be a background analysis instead of inline feedback?
* Can I afford multi-step chains for this interaction?

### 2. Cost

Model size and context length directly increase cost.

| Choice                     | Impact on Cost | Impact on UX                  |
| -------------------------- | -------------- | ----------------------------- |
| Larger model               | Higher         | Better reasoning, slower      |
| Longer context window      | Higher         | More grounded, more expensive |
| Frequent calls per session | Much higher    | More interactive feel         |
| Smaller fallback model     | Lower          | Slight quality trade-off      |

I often design tiered strategies. A smaller model handles common paths. A larger model is triggered only when confidence is low or task complexity is high.

### 3. Capacity and Rate Limits

If usage scales 10x, infra cost often scales with it. That forces me to think about:

* Concurrency limits
* User-level quotas
* Enterprise usage caps
* Internal rate limiting to prevent abuse

These are product levers as much as technical safeguards.

### 4. Reliability and SLOs

AI features that work 90 percent of the time are not production ready.

I ask:

* What happens if the model endpoint times out?
* Do we retry?
* Do we degrade gracefully?
* Is there a non-AI fallback path?

Reliability design is part of trust design.

---

## 5. Practical Conversations I Lead

At this layer, I make sure I can lead conversations such as:

* Can we afford to call this model on every keystroke?
* What is our acceptable p95 latency?
* Should we stream responses to improve perceived performance?
* Do we need a smaller model for high-frequency interactions?
* How does projected usage growth affect margin?

I do not need to understand GPU kernel optimizations. I do need to understand how model size, context length, and request frequency compound into cost and latency.

---

## 6. The Artifact I Produce

For any serious AI feature, I create a short infra note with:

1. Target latency and acceptable upper bounds
2. Estimated cost per request at different usage volumes
3. Model selection strategy with rationale
4. Fallback and degradation plan
5. How infra constraints influenced UX decisions

This keeps infrastructure anchored to product outcomes.

Layer 1 may be invisible to users, but it determines whether the feature feels instant or slow, scalable or fragile, premium or unsustainable. As a AI Product Manager, I treat infra as a first-class input into product strategy, not just an engineering afterthought.
