# Layer 1 – Infra

**Question answered:**  
> What physical and cloud infrastructure is needed to train and run LLMs, and why does it matter for product decisions?

## 1. Overview

Layer 1 covers the **hardware and infrastructure** that make large language models possible, and the constraints this creates for real products.

It corresponds to the original:

- **Layer 1 – Hardware & Infra**

## 2. What this layer includes

- GPUs / TPUs and other accelerator hardware  
- Clusters and high-speed interconnects  
- Training vs inference workloads  
- Horizontal vs vertical scaling  
- Latency, throughput, and rate limits  
- Cost per token / per request  
- Reliability and SLOs

## 3. Why it matters for product decisions

Infrastructure is rarely designed by product managers, but it defines important **constraints**:

- **Latency:**  
  - How “snappy” the feature can be (sub-second, 2–3 seconds, or more).  
- **Cost:**  
  - Larger models and longer prompts cost more per call.  
- **Capacity & rate limits:**  
  - How many concurrent users or requests the system can support.  
- **Model choice:**  
  - Sometimes a smaller, cheaper model is needed for frequent or low-value actions.

## 4. PM depth (what is sufficient)

A product manager should:

- Understand the **difference between training and inference**.  
- Know that **inference is not free**, and that:
  - Bigger model + longer context → higher cost + higher latency.  
- Be able to have basic conversations about:
  - “Can we afford to call this model on every keystroke?”  
  - “Do we need streaming responses to hide latency?”  
  - “Should this feature use a smaller model most of the time and a larger one in certain paths?”

Deep, low-level hardware knowledge (GPU architectures, kernel optimizations, etc.) is **not necessary** for typical PM work.

## 5. Example questions a PM might ask at this layer

- What are the latency targets for this feature?  
- What model(s) can realistically be used given our budget and scale?  
- How will usage grow, and what does that mean for infra cost?  
- Do we need any kind of rate limiting, quotas, or usage caps?

## 6. Suggested artifacts

- A short internal note explaining:
  - Training vs inference  
  - Latency and cost trade-offs  
  - How these trade-offs influence design for a specific AI feature.
