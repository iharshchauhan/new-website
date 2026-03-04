---
title: "Layer 5: App and Product Strategy"
date: "2026-02-25"
description: "A product framework for mapping AI capabilities to user jobs, UX patterns, system constraints, and business outcomes."
category: "Frameworks"
tags: ["Framework", "Product", "UX"]
---

# Layer 5: App / Product Strategy

**Core question**
What is the actual product, who is it for, how does AI manifest in the interface, and how do I tie technical architecture to measurable business outcomes?

If Layers 1 to 4 define capability and reliability, Layer 5 defines value capture.

This is where I translate infra, models, RAG, tools, and orchestration into:

* Clear user value
* Opinionated UX
* Sustainable economics
* Strategic defensibility

AI is not the product. The workflow transformation is.

---

# 5.1 From Capability to Job-To-Be-Done

I start with the job, not the model.

## Capability -> Job Mapping Framework

| AI Capability         | User Job                        | Non-AI Alternative        | Why AI Wins                 |
| --------------------- | ------------------------------- | ------------------------- | --------------------------- |
| Summarization         | Understand long content quickly | Manual reading            | Time compression            |
| Generation            | Draft first version             | Blank page writing        | Cognitive acceleration      |
| Classification        | Route or tag items              | Rules engine              | Higher recall on edge cases |
| Retrieval + reasoning | Answer grounded questions       | Search + manual synthesis | Reduced context switching   |
| Tool execution        | Complete multi-step task        | Manual workflows          | Automation at scale         |

I explicitly document why AI is necessary. If a deterministic rule solves it cheaper and more reliably, I use rules.

---

# 5.2 Persona, Workflow, and Context Modeling

AI performance is deeply contextual. I model:

* User expertise level
* Frequency of task
* Risk sensitivity
* Latency tolerance
* Trust requirements

## Workflow Decomposition Example

Instead of saying "Build an AI assistant," I break it into:

```
Trigger Event
    |
Context Gathering
    |
AI Processing
    |
User Review
    |
Action or Save
```

For each step, I decide:

* Is AI visible or invisible?
* Is output editable?
* Is confirmation required?
* Is the action reversible?

---

# 5.3 Interaction Pattern Architecture

The UX pattern determines cognitive load, perceived intelligence, and trust.

## AI Interaction Pattern Matrix

| Pattern              | Control Level     | Best For                  | Risk Level |
| -------------------- | ----------------- | ------------------------- | ---------- |
| Autocomplete         | High user control | Micro productivity boosts | Low        |
| Inline suggestion    | Medium            | Draft improvement         | Low-Medium |
| Side panel assistant | Medium            | Context-aware guidance    | Medium     |
| Chat interface       | Flexible          | Exploration and Q&A       | Medium     |
| One-click transform  | Low               | Deterministic rewrite     | Medium     |
| Background agent     | Very low          | Automation                | High       |

As a PM, I deliberately choose where on the control spectrum I operate.

More autonomy increases leverage but also increases governance burden.

---

# 5.4 Human-in-the-Loop Design

AI systems must expose the right review surfaces.

## Review Architecture

```
AI Output
    |
Editable Layer
    |
Approval or Rejection
    |
Execution
```

Key decisions I make:

* Does the user edit raw output or structured fields?
* Do I show reasoning or just results?
* Do I show sources and confidence?
* Is feedback captured implicitly or explicitly?

Trust is a UX system, not a marketing claim.

---

# 5.5 Feedback as a Data Flywheel

Feedback is not decoration. It is model improvement infrastructure.

## Feedback Capture Types

| Type              | Signal Quality | Cost   |
| ----------------- | -------------- | ------ |
| Thumbs up/down    | Low            | Low    |
| Inline edits      | High           | Medium |
| Structured rating | Medium         | Medium |
| Outcome tracking  | Very high      | High   |

I prioritize feedback tied to outcomes, not just opinions.

For example:

* Did the suggested draft get sent?
* Was the generated ticket resolved faster?
* Did automation reduce manual hours?

Outcome-linked signals create defensibility.

---

# 5.6 System-to-UX Traceability

Every UX decision maps downward into technical layers.

## Example Traceability Table

| UX Requirement             | Technical Dependency              |
| -------------------------- | --------------------------------- |
| Show citations             | RAG with source metadata          |
| Real-time suggestions      | Low-latency inference + streaming |
| Action automation          | Tool calling + policy layer       |
| Editable structured output | Schema-constrained decoding       |
| Fast perceived response    | Caching + partial rendering       |

I ensure this traceability is documented. Otherwise UX promises exceed system capacity.

---

# 5.7 Unit Economics and Packaging

AI features introduce variable cost at inference time. I design pricing with this in mind.

## Cost Stack Awareness

```
User Action
    |
Model Tokens (Cost Driver)
    |
Retrieval Queries
    |
Tool Calls
    |
Infra Overhead
```

I calculate:

* Cost per successful outcome
* Margin at different usage tiers
* Break-even usage thresholds

## Packaging Strategies

| Strategy             | Rationale                    |
| -------------------- | ---------------------------- |
| Usage-based metering | Align cost with heavy users  |
| Feature gating       | Monetize advanced workflows  |
| Credit systems       | Encourage experimentation    |
| Tiered model access  | Smaller model for basic tier |

A technical AI PM must understand token economics as deeply as feature UX.

---

# 5.8 Adoption and Impact Metrics

I measure success at four levels.

## Metric Stack

| Layer      | Metric Type     | Examples                    |
| ---------- | --------------- | --------------------------- |
| Activation | Initial usage   | % users who try AI feature  |
| Engagement | Repeated usage  | Weekly active AI users      |
| Outcome    | Workflow impact | Time saved, throughput gain |
| Business   | Revenue impact  | ARPU lift, retention delta  |

AI novelty metrics are not enough. I care about workflow displacement.

If users revert to manual behavior, the feature failed.

---

# 5.9 Strategic Defensibility

The final question I ask myself:

What makes this AI product hard to replicate?

Possible moats include:

* Proprietary data pipelines
* Unique workflow embedding
* Outcome-linked feedback loops
* Deep tool integrations
* Cost-optimized orchestration

Models commoditize. Workflow depth compounds.

---

# What I Produce at Layer 5

For every serious AI feature, I create:

1. A mini-PRD with explicit JTBD mapping
2. Workflow diagram with AI insertion points
3. UX pattern rationale
4. System traceability table
5. Unit economics estimate
6. Metric definition sheet

Layer 5 is where intelligence meets intention.

```
Infra -> possibility
Models -> capability
Data -> relevance
Orchestration -> reliability
Product strategy -> value
```
