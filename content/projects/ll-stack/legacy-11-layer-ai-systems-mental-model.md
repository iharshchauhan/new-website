---
title: "Legacy: 11-Layer AI Systems Mental Model"
date: "2025-11-13"
description: "Original 11-layer mental model that later evolved into the practical 5-layer LLM stack."
category: "Frameworks"
tags: ["Framework", "AI Systems", "Legacy"]
---

# Legacy 11-Layer AI Systems Mental Model

**Core question**
How do I map every AI product decision, from infrastructure to UX, into a traceable system that is reliable, governable, and economically viable in production?

I use this 11-layer model when I need full-stack diagnostic clarity. My 5-layer map is better for communication speed, but this 11-layer version is better for architecture reviews, failure analysis, and roadmap sequencing.

## Stack Framing

I treat this stack as a dependency graph, not a linear checklist.

```
L11 Product Outcomes
        |
L10 Observability + Safety + Governance
        |
L9 Multi-Agent Coordination
        |
L8 Single-Agent Control Loop
        |
L7 Orchestration Workflows
        |
L6 Knowledge + Tools
        |
L5 Prompt/Fine-tune Adaptation
        |
L4 Alignment Behavior
        |
L3 Transformer Constraints
        |
L2 Pretraining Limits
        |
L1 Infra Capacity + Cost Envelope
```

When something fails in production, I debug top-down and fix bottom-up.

## Layer 1: Hardware and Infra

At this layer, I define hard resource boundaries: latency budget, throughput ceiling, and unit cost envelope.

I do not need to optimize kernels, but I need to know when product ambition violates infra physics. If p95 latency target is 1.5s and average context is 18k tokens, I already know I need routing, caching, or product redesign.

| Decision | UX Impact | Cost Impact | Reliability Impact | Common Failure Mode |
| --- | --- | --- | --- | --- |
| Larger model default | Better answer quality on hard tasks | Higher variable inference spend | Higher timeout risk under load | Queue saturation |
| Smaller model default | Faster and more responsive | Lower unit cost | Better throughput stability | Quality drops on complex requests |
| Single-region deployment | Consistent behavior in one market | Lower ops overhead | Regional outage blast radius | Regional downtime |
| Multi-region deployment | Better global responsiveness | Higher infra cost | Better resilience | Config drift across regions |

## Layer 2: Data and Pretraining

This layer defines what the base model can know without my system injecting context. I treat the pretraining cutoff as a product limitation that must be explicitly handled in UX and policy.

If a workflow needs current policy data or customer-specific facts, I plan RAG or tools by default. I do not assume pretrained knowledge is sufficient for operational tasks.

## Layer 3: Transformer Architecture Constraints

This layer gives me a mechanical model of capability versus latency and cost.

Context windows are budget containers. Tokens are both reasoning capacity and billing units. More context often improves grounding, but increases latency and spend.

| Variable | Primary Effect | Secondary Effect | PM Action |
| --- | --- | --- | --- |
| Context window size | Improves recall for long inputs | Increases response time and token spend | Cap input and add retrieval |
| Model parameter scale | Better reasoning on complex tasks | Higher compute cost | Route by task complexity |
| Output token limit | More complete answers | Higher completion latency | Use schema and bounded response size |

## Layer 4: Base Training and Alignment

Alignment drives behavioral profile: refusal boundaries, style, and risk posture. I treat model selection as governance selection as much as quality selection.

For regulated workflows, I choose conservative alignment and explicit review paths. For internal drafting, I can tolerate more creative behavior if outputs stay editable.

## Layer 5: Adaptation to Use Case (Prompts and Fine-tuning)

At this layer, I control behavior with structured prompts, output contracts, and when justified, model adaptation.

I start with prompt architecture because it is fast to iterate and cheap to roll back. I move to fine-tuning only when repeated error classes remain after prompt and retrieval improvements.

| Situation | Default Lever | Why |
| --- | --- | --- |
| New feature exploration | Prompting | Fast iteration with low lock-in |
| Strict JSON workflow | Prompt + schema validation | Higher reliability in downstream automation |
| Stable high-volume classification | Fine-tuning candidate | Better consistency and lower prompt complexity |

Failure mode I watch: hidden prompt drift. I version prompts like code and require evaluation before deployment.

## Layer 6: Knowledge and Tools

This is where the model becomes product-specific and action-capable.

```
User Query
   |
Retrieve Context (RAG)
   |
Tool Decision
   |
API/DB Action
   |
LLM Response with Evidence
```

RAG handles knowledge grounding. Tools handle state reads and state changes. I separate them because their failure modes differ.

| Mechanism | Best Use | Risk | Control |
| --- | --- | --- | --- |
| RAG | Policy and doc-grounded answers | Stale or irrelevant retrieval | Metadata filters + source display |
| Tool calls | Live state and workflow actions | Wrong action with valid syntax | Permission scopes + approval gates |

Economic implication: retrieval cost is usually small relative to repeated large-model calls, so better retrieval often lowers total spend by reducing retries and escalations.

## Layer 7: Orchestration and Workflows

This layer is execution topology. I explicitly model retries, branching, and fallback paths.

```
Validate -> Route -> Retrieve -> Generate -> Verify -> Respond -> Log
```

Every extra step improves control but adds latency and new failure states. I keep the workflow minimal until evidence proves complexity is needed.

## Layer 8: Single-Agent Systems

I use a single agent when the task requires iterative discovery with tool use, not when a deterministic chain already solves it.

Agent loop:

```
Goal -> Plan -> Act -> Observe -> Decide next step -> Stop or continue
```

I enforce stop conditions, max step count, and tool permission boundaries. Without those controls, latency and cost can spike unpredictably.

## Layer 9: Multi-Agent Systems

I only use multi-agent designs when specialization produces measurable quality gain that offsets orchestration overhead.

Typical pattern:

```
Planner -> Researcher -> Executor -> Reviewer -> Finalizer
```

Tradeoff table:

| Architecture | Quality Potential | Latency | Cost | Operational Complexity |
| --- | --- | --- | --- | --- |
| Single chain | Medium | Low | Low | Low |
| Single agent | Medium to high | Medium | Medium | Medium |
| Multi-agent | High on complex tasks | High | High | High |

## Layer 10: Observability, Evaluation, Safety, Governance

This layer determines whether the system can be trusted in production.

I run two evaluation loops:

1. Offline loop for regression prevention.
2. Online loop for live performance and risk monitoring.

| Evaluation Plane | What I Measure | Release Decision Use |
| --- | --- | --- |
| Offline | Accuracy, faithfulness, format validity, safety violations | Block or allow deployment |
| Online | Task success, latency, user correction rate, cost per successful task | Tune routing, prompts, and policies |

For governance, I require prompt versioning, tool scope controls, and auditable traces for every high-risk action.

## Layer 11: Product Layer (UX and Business)

This is the layer where value is created or lost. I map user-facing behavior to lower-layer dependencies before launch.

### UX to System Traceability

| UX Requirement | Layer Dependencies | Primary Risk if Missing |
| --- | --- | --- |
| Fast interactive response | L1 infra, L3 token budget, L7 routing | User abandonment |
| Citation-backed answer | L6 retrieval quality, L10 traceability | Trust collapse |
| Safe automation action | L6 tool permissions, L7 approval branch, L10 governance | Policy incident |
| Consistent output format | L5 schema prompting, L10 eval gating | Workflow breakage |

### Product Economics Lens

I track cost per successful outcome, not cost per call in isolation.

```
Cost per outcome =
(model tokens + retrieval + tool execution + orchestration overhead)
/ successful task completions
```

If quality drops and users re-run tasks, cost per outcome increases even if per-call cost appears low. This is why reliability and UX design are economic controls, not just quality controls.

## How I Use This Model in Practice

I use this 11-layer model for architecture reviews, incident retrospectives, and roadmap tradeoff decisions. It forces me to connect technical design to user trust, governance posture, and margin structure.

The 5-layer model is my communication layer. The 11-layer model is my operating model.
