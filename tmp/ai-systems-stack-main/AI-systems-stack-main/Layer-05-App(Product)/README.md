
# Layer 5 – App / Product

**Question answered:**  
> What is the actual product, who is it for, how does the AI show up in UX, and how is success measured?

Layer 5 is where everything becomes visible to the user. It connects the technical stack to **real problems, workflows, and outcomes**.

It corresponds to the original:

- **Layer 11 – Product Layer (UX, Jobs-To-Be-Done, Business)**

---

## 5.1 What this layer includes

- **Use case & Jobs-To-Be-Done (JTBD):**
  - The underlying job the user is trying to get done.  
- **Personas & workflows:**
  - Who is using this and in what context.  
- **Interaction patterns:**
  - Chat interface, structured form, autocomplete, command palette, background assistant, etc.  
- **Human-in-the-loop:**
  - When the user must review, edit, or approve AI output.  
- **Feedback mechanisms:**
  - Ratings, flags, inline edits, comments—used as quality signals or training data.  
- **Pricing & packaging:**
  - What is free vs paid, metering, usage quotas, premium AI features.  
- **Impact & adoption metrics:**
  - Usage, retention, time saved, productivity, error reduction, revenue impact.

---

## 5.2 PM perspective

At this layer, AI is a **means**, not the goal. The key questions are:

- Who is the user?  
- What job are they hiring this AI feature to do?  
- Why is AI a better approach than a static workflow, search, or simple rules?  
- What should the interaction feel like?
  - Quick suggestions vs deep analysis vs ongoing assistant.  
- How is success measured?
  - Time saved, reduction in manual effort, better decisions, higher throughput, improved satisfaction.

A product manager should be able to:

- Tell a clear **product story** for each AI-powered feature.  
- Connect decisions in lower layers (prompting, RAG, agents, infra) back to:
  - UX, reliability, and business goals.

---

## 5.3 Example considerations

- Should the assistant be:
  - A chat-style interface,  
  - A side panel suggestion engine,  
  - A “one-click transform” button,  
  - Or a background agent acting on a schedule?  
- How often should the user see:
  - Explanations (“Why this answer?”),  
  - Source citations,  
  - Confidence indicators?  
- What happens when the AI is wrong?
  - Can the user undo actions?  
  - How are corrections captured and used?  
- How are users onboarded and educated?
  - Expectations about capabilities and limits.  

---

## 5.4 Suggested artifacts for Layer 5

For each AI feature or side project, it is useful to have:

- A short **Product Notes** or mini-PRD including:
  - Problem statement and JTBD.  
  - Target persona(s) and usage context.  
  - Role of AI (assistant, generator, summarizer, reviewer, decision helper).  
  - Chosen interaction pattern and rationale.  
  - High-level mapping to lower layers:
    - How prompting, RAG, and tools support the UX.  
  - Success metrics and basic evaluation approach.

This keeps the emphasis on **outcomes and experience**, while still linking back to the technical stack underneath.
