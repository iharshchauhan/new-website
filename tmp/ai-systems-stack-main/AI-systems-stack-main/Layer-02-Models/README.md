# Layer 2 – Models

**Question answered:**  
> What is an LLM under the hood, and why do different models behave differently?

Layer 2 is the **conceptual backbone**. Once this is clear, later layers (RAG, prompting, context limits) make intuitive sense.

It corresponds to the original:

- **Layer 2 – Data & Pretraining**  
- **Layer 3 – Model Architecture (Transformers)**  
- **Layer 4 – Base Training & Alignment**

---

## 2.1 Data & Pretraining

### What this sub-layer covers

- Pretraining corpus:
  - Web pages, code, books, documentation, and other large-scale text sources.  
- Self-supervised learning:
  - The model learns to predict the **next token** given previous tokens.  
- Scale laws:
  - More data, more parameters, and more compute generally improve performance (with diminishing returns).  
- Training cut-off date:
  - The model’s world knowledge is limited to what existed before this date.

### PM perspective

- A **base model** has broad, general world knowledge but **does not know**:
  - Company-specific data, internal docs, customer configs, or latest policies.  
- Fresh/ private / internal knowledge must be added later via:
  - **RAG** (retrieval),  
  - **Fine-tuning**, or  
  - Direct **tool/DB integration**.

---

## 2.2 Transformer Architecture

### What this sub-layer covers

- Tokens & tokenization:
  - Text is split into tokens; prices, context, and limits are expressed in tokens.  
- Self-attention:
  - Mechanism that lets the model “look back” at previous tokens and decide which ones matter.  
- Multi-head attention:
  - Multiple attention “heads” capture different patterns or relations in the sequence.  
- Context window:
  - Hard limit on how many tokens the model can see at once (e.g., 8k, 32k, 128k tokens).  
- Parameters:
  - Number of weights (billions), affecting capacity, quality, and cost.

### PM perspective

A product manager should be able to explain in simple terms that:

- The model sees text as **tokens**, not characters or words directly.  
- The context window is a **hard cap**:
  - Long documents or many messages cannot simply be “dumped” into the model; summarization or retrieval are needed.  
- Larger models and longer context windows typically mean:
  - Better capabilities but **slower and more expensive** calls.

This understanding is critical when designing:

- How much context to send in each request.  
- Whether to use RAG instead of passing entire documents.  
- When to choose smaller vs larger model variants.

---

## 2.3 Training & Alignment

### What this sub-layer covers

- Base model:
  - Raw model after pretraining; powerful but not yet polite or safe.  
- Instruction tuning:
  - Additional training on (instruction → response) pairs to make the model follow instructions.  
- RLHF / RLAIF:
  - Reinforcement Learning from Human/AI Feedback to adjust behavior (helpfulness, tone, safety).  
- Model families:
  - General-purpose chat models, code-focused models, small on-device models, domain-specific models.

### PM perspective

Different models behave differently because of:

- **Training data** (what they saw).  
- **Objectives** (what they were optimized for).  
- **Alignment policies** (how aggressive or conservative they are).

A PM should be able to:

- Explain why one model feels better for code, another for general chat.  
- Choose a model that matches the feature:
  - For example, a support assistant vs a code review assistant vs a device-local summarizer.

---

## Suggested artifacts for Layer 2

- A concise markdown note:
  - “What is a transformer?” in 8–10 steps.  
  - Definitions of tokens, context window, parameters, and why they matter.  
- A small comparison of available model families:
  - Capabilities, context size, typical use cases, cost/latency tier.
