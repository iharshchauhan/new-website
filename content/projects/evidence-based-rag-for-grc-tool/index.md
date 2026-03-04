---
title: "Product Prototype: Evidence-Based RAG for GRC Tool"
date: "2026-03-05"
description: "A controlled Retrieval-Augmented Generation prototype for enterprise GRC that answers only from approved policy evidence."
category: "Proof of work"
tags: ["RAG", "GRC", "Compliance", "Enterprise AI", "LangChain", "ChromaDB"]
---

## Why I Built This

Over the last several years working in B2B and enterprise product roles, I have repeatedly seen the same operational bottleneck. Smart teams, strong compliance intent, but fragmented knowledge. Policies exist. Controls exist. Audit logs exist. Yet when an employee or auditor asks a simple question such as "How quickly must a security incident be reported?" the answer requires digging through PDFs, Notion pages, ticketing systems, and sometimes Slack threads.

In one hypothetical scenario that mirrors what I have seen in real environments, imagine an enterprise compliance team handling 1,200 internal control queries per month. Analysts manually search documentation, interpret clauses, and respond to stakeholders. Even with strong process discipline, interpretation risk remains. If a generic large language model is introduced without guardrails, it might generate a confident answer that is technically plausible but not aligned with the company's approved policy. In a regulated environment, that is unacceptable.

As an AI Product Manager who has worked on workflow automation, decision systems, and RAG infrastructure at scale, I approached this differently. I asked myself, what if we treated AI not as a creative assistant, but as a controlled policy intelligence layer? What if every answer had to be grounded in approved internal documentation before being generated?

This prototype is my answer to that question.

---

## Product Vision

The objective is straightforward. I want to build a Retrieval-Augmented Generation assistant that answers enterprise risk, compliance, and control questions strictly from approved corporate policies, regulatory frameworks, and internal standards.

The strategic shift here is subtle but critical. Instead of allowing the model to rely on pretraining data, we force it to retrieve relevant policy context first. Only after retrieving authoritative context do we allow answer construction. This architecture ensures traceability, reduces hallucinations, and aligns with audit expectations.

From my experience designing AI workflows with confidence thresholds and human-in-the-loop review systems, I know that reliability is not achieved by prompts alone. It is achieved through architecture. That is why this prototype focuses more on system design than on model cleverness.

---

## The Enterprise Context I Am Solving For

In regulated environments, Governance, Risk, and Compliance systems must satisfy strict expectations. AI cannot be a black box. It must be auditable. It must be explainable. It must be controllable.

In practice, that means we design systems that:

1. Retrieve from a curated source of truth.
2. Generate only within the boundaries of retrieved evidence.
3. Surface the supporting context for review.
4. Fail predictably when no policy evidence exists.

When I previously built AI-driven workflow systems that reduced manual operations significantly, the biggest learning for me was that automation is not about removing humans. It is about creating structured confidence. The same philosophy applies here.

---

## Architecture Overview

This prototype uses a modern GenAI stack designed for enterprise reliability.

LangChain orchestrates retrieval and generation flow. ChromaDB acts as the vector store. HuggingFace embeddings convert policy text into vector representations. The data source is a simulated Enterprise Information Security and Compliance Policy for 2025.

I deliberately kept the dataset small for demonstration clarity, but the architecture is scalable. In real deployments, I would layer in document versioning, metadata filters, access control constraints, and evaluation pipelines.

---

# Cell 1: Install GenAI Stack

```python
# LangChain is the industry standard for building LLM apps (Updated for Latest LangChain v0.3+)
!pip install -q --upgrade requests==2.32.5
!pip install -q langchain langchain-community langchain-core langchain-text-splitters langchain-huggingface langchain-chroma chromadb sentence-transformers
!pip install -q opentelemetry-exporter-otlp-proto-http==1.30.0 opentelemetry-api==1.30.0 opentelemetry-sdk==1.30.0

import os

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

print("GenAI Environment Configured.")
```

In production, I would additionally integrate observability tooling, structured logging, and evaluation hooks. Based on my past work building AI pipelines, instrumentation is not optional. It is foundational.

```python
# Splitting the guideline text into smaller chunks for the Vector DB
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
texts = text_splitter.split_text(guideline_text)

# Wrap text chunks into LangChain Document objects
docs = [Document(page_content=t) for t in texts]

print(f"Split guideline into {len(docs)} document chunks.")
```

Chunking strategy matters. In previous RAG systems I have built, retrieval quality improved significantly when chunk boundaries aligned with logical policy sections rather than arbitrary character counts. For this prototype, I use a simple recursive splitter for clarity.

---

# Cell 2: Ingest Simulated Enterprise Policy

```python
guideline_text = """
POLICY TITLE: Enterprise Information Security & Compliance Policy (2025)

1. ACCESS CONTROL:
All privileged access must follow the principle of least privilege and require formal approval.
User access reviews must be conducted quarterly.

2. INCIDENT MANAGEMENT:
Security incidents must be reported within 1 hour of detection.
All critical incidents require a root cause analysis within 5 business days.

3. DATA PROTECTION:
Sensitive data must be encrypted at rest and in transit using approved encryption standards.
Data classification levels: Public, Internal, Confidential, Restricted.

4. THIRD-PARTY RISK MANAGEMENT:
All vendors handling confidential or restricted data must undergo a security risk assessment annually.

5. AUDIT & LOGGING:
Security logs must be retained for a minimum of 12 months.
Privileged activity must be monitored and reviewed regularly.
"""
```

This simulated policy represents the type of structured enterprise documentation I have worked with in compliance platforms. In real deployments, ingestion would include metadata tagging such as control ID, framework mapping, risk category, and effective date.

---

# Cell 3: The Brain, Vector Database

```python
embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

db = Chroma.from_documents(
    documents=docs,
    embedding=embedding_function
)

print("Knowledge Base Vectorized and Stored in ChromaDB.")
```

When I think about this layer from a product lens, I do not see just a database. I see a decision substrate. Every future answer depends on how well this layer retrieves relevant context. In enterprise AI systems I have previously built, retrieval tuning alone improved answer precision more than prompt rewriting.

---

# Cell 4: Controlled Retrieval Logic

```python
def ask_grc_assistant(query):
    results = db.similarity_search(query, k=2)
    context = "\n".join([doc.page_content for doc in results])

    print(f"USER QUERY: {query}")
    print("RETRIEVED POLICY CONTEXT:")
    print(f"{context}")
    print("-" * 30)

    if "least privilege" in context:
        return "All privileged access must follow least privilege and be formally approved. Quarterly access reviews are required."
    elif "1 hour" in context and "incident" in context.lower():
        return "Security incidents must be reported within 1 hour of detection, with root cause analysis for critical incidents."
    elif "encrypted" in context:
        return "Sensitive data must be encrypted at rest and in transit using approved encryption standards."
    else:
        return "No relevant requirement found in approved enterprise policies."
```

Notice the philosophy here. We retrieve first. We expose context. We answer only if evidence exists. If not, we explicitly state that no requirement was found. That predictable failure mode is critical for regulated environments.

In a scaled product, I would layer in confidence scoring, escalation workflows, and audit logging for every query. Based on my experience building AI automation systems, governance is not a feature that can be added later. It must be embedded from day one.

---

# Cell 5: Testing the System

```python
response = ask_grc_assistant("How quickly must a security incident be reported?")
print(f"GRC ASSISTANT: {response}")
```

If this were deployed inside a compliance platform, the assistant would display the cited policy clause alongside the answer. An auditor could trace the response back to the exact document section. That closes the loop between AI convenience and governance integrity.

---

## Final Reflection

As an AI Product Manager, I view this prototype not as a chatbot demo but as a controlled decision system. It reflects how I think about enterprise AI. Structured retrieval. Deterministic boundaries. Human override paths. Observable workflows.

If I were taking this from prototype to production, my roadmap would include policy version control, role-based access filters, framework cross-mapping, automated evaluation datasets, and staged rollouts from pilot to general availability. That approach mirrors how I have previously scaled AI products from zero to meaningful enterprise adoption.

Ultimately, my goal is simple. I want AI systems inside enterprises to reduce manual burden without increasing regulatory risk. This RAG architecture is a concrete step toward that outcome.
