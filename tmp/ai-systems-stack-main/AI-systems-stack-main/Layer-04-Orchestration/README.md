
# Layer 4 – Orchestration (Workflows, Agents, Evals, Safety)

**Question answered:**  
> How do prompts, RAG, tools, and models run together in production, and how is the system evaluated and governed?

Layer 4 combines execution flow, agent behavior, evaluation, and safety.

It corresponds to the original:

- **Layer 7 – Orchestration / Workflows**  
- **Layer 8 – Agents (Single-Agent Systems)**  
- **Layer 9 – Multi-Agent Systems**  
- **Layer 10 – Observability, Evaluation, Safety, Governance**

---

## 4.1 Workflows / Chains

### What this sub-layer covers

- Chains / pipelines:
  - Multi-step flows: e.g., “classify → retrieve → call LLM → post-process → save → respond.”  
- Routing:
  - Sending different requests to different models or flows (by input type, risk level, or user).  
- Caching:
  - Reusing prior LLM responses or retrieval results to save cost and latency.  
- Fallbacks & multi-model strategies:
  - Trying a smaller/cheaper model first, then falling back to a bigger/more capable one.

### PM perspective

- A PM should be able to represent a feature as a **simple flow diagram**:
  - Inputs → steps (with decisions) → outputs.  
- Decide where:
  - Retrieval happens.  
  - Tools are called.  
  - Human approval is required.  
- Understand how each added step impacts:
  - Latency, reliability, and cost.

---

## 4.2 Agents – Single & Multi-Agent Systems

### Single-Agent Systems

- One LLM-driven “worker” that:
  - Has a goal (e.g., “summarize this inbox,” “plan this trip”).  
  - Uses tools (APIs, DB queries, web search).  
  - Maintains state (scratchpad, conversation history).  
  - Iterates: think → act → observe → refine.

### Multi-Agent Systems

- Multiple agents with distinct roles:
  - Planner, researcher, coder, reviewer, supervisor, etc.  
- Agents communicate via messages or shared memory.  
- Debate / ensemble patterns:
  - Multiple agents produce candidate outputs; another agent chooses or merges them.

### PM perspective

- An **agent** is essentially: LLM + tools + memory + a loop.  
- Multi-agent setups are powerful for complex tasks but add:
  - Latency, cost, and debugging complexity.

A PM should:

- Recognize when a **simple chain** is enough.  
- Identify when a more flexible agent-style loop might be beneficial:
  - Open-ended tasks, multi-step plans, creative exploration.

---

## 4.3 Observability, Evaluation, Safety, Governance

### What this sub-layer covers

- Offline evaluation:
  - Test sets of inputs with expected or “gold” outputs, or quality labels.  
- Online metrics:
  - Outcome metrics (conversion, time saved, resolution rate),  
  - Experience metrics (CSAT, NPS).  
- Tracing:
  - Logging prompts, retrieved context, tool calls, and responses for debugging and analysis.  
- Guardrails:
  - Input validation (block disallowed topics or formats).  
  - Output filtering (block PII, toxicity, hallucinated harmful content).  
  - Policy enforcement (ensure the system does not take high-risk actions without approval).  
- Governance:
  - Who can change prompts, tools, or flows.  
  - How changes are reviewed, tested, and rolled out.

### PM perspective

- Define **what “good enough” means** for an AI feature:
  - Accuracy, helpfulness, safety thresholds.  
- Design a basic evaluation plan:
  - Test cases, expected behavior, manual review process.  
- Understand what will be monitored in production:
  - How regressions will be detected.  
  - How incident response would work if the model behaves badly.

---

## Suggested artifacts for Layer 4

- A simple **flow diagram** or markdown description of the end-to-end pipeline for one AI feature.  
- A small **evaluation checklist**:
  - Inputs, expected outputs, pass/fail criteria.  
- A note on **guardrails and approvals**:
  - What the model is allowed to do automatically,  
  - When it must ask for confirmation or escalate to a human.
