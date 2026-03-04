
# Layer 3 – Data & Knowledge (Prompts, RAG, Tools)

**Question answered:**  
> How is a general LLM adapted to a specific product, and how does it see the product’s data?

Layer 3 is the **core practical layer** for PMs building LLM-powered features.

It corresponds to the original:

- **Layer 5 – Adaptation to Your Use Case (Prompts & Fine-tuning)**  
- **Layer 6 – Knowledge & Tools (RAG, Search, APIs, DBs)**

---

## 3.1 Adaptation via Prompts & Fine-Tuning

### What this sub-layer covers

- **System prompts:**
  - Global instructions that set role, behavior, and constraints.  
  - Example: “You are a cautious recipe assistant. You only suggest recipes that can be made with the ingredients provided and basic pantry staples.”  
- **User prompts:**
  - The user’s input or a structured representation of it (e.g., from a form or UI).  
- **Few-shot prompting:**
  - Adding a small number of example pairs to demonstrate style or logic.  
- **Structured output:**
  - Asking the model to produce JSON, tables, or fixed templates that downstream code can reliably parse.  
- **Fine-tuning:**
  - Additional training with labeled examples to specialize behavior.  
- **Parameter-efficient tuning:**
  - LoRA, adapters, and other techniques that update fewer parameters.

### PM perspective

- Prompting is the **first and cheapest lever** to shape behavior.  
- Fine-tuning becomes attractive when:
  - The task is narrow and repeated often.  
  - High consistency is required.  
  - Enough labeled examples exist (or can be collected).

A PM should be comfortable:

- Designing a clear system prompt.  
- Defining the desired output format.  
- Creating and maintaining **test cases** to validate prompt behavior.  
- Knowing when to propose fine-tuning as a next step.

---

## 3.2 RAG, Embeddings, and Tools

### RAG (Retrieval-Augmented Generation)

#### What this covers

- Embeddings:
  - Numeric vectors representing text such that similar meanings are close in vector space.  
- Vector databases:
  - Stores embeddings + metadata and supports similarity search (e.g., Supabase + pgvector, Pinecone, Weaviate).  
- Chunking:
  - Splitting documents into manageable segments (e.g., 200–800 tokens) with some overlap.  
- Classic RAG pipeline:
  1. **Indexing time:**  
     - Take docs → chunk them → compute embeddings → store in vector DB with metadata.  
  2. **Query time:**  
     - Embed the user’s query → find top-k similar chunks → build a `Context:` section → call the LLM with context + question.  

### Tools & External Systems

#### What this covers

- Function calling / tool use:
  - The model is given a catalog of tools with schemas; it decides when and how to call them.  
- Databases & APIs:
  - SQL queries, internal services, search indices, analytics systems.  
- Other ML models:
  - Recommenders, classifiers, ranking models used alongside the LLM.

### PM perspective

- RAG is used when the product needs to access:

  - Private data (internal docs, customer configs).  
  - Frequently changing data (policies, inventories).  
  - Long or detailed content that cannot fit into the context window at once.

- RAG design choices include:

  - What content to index.  
  - How to chunk it.  
  - What metadata (tags, permissions, timestamps) to store.  
  - How many chunks to inject and how to format the `Context:`.

- Tools are used when:

  - The LLM must **perform actions** (e.g., create a ticket, fetch a record, send an email).  
  - The system needs accurate numbers or state from a DB instead of model “guesses”.

---

## Suggested artifacts for Layer 3

- A well-documented **system prompt** and user prompt structure for a specific feature.  
- A small **RAG design**:
  - Schema of the knowledge base,  
  - Chunking strategy,  
  - Retrieval approach,  
  - Example `Context:` section.  
- A short explanation of when RAG vs fine-tuning vs tool calling is appropriate for that feature.
