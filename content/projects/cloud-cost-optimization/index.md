---
title: "Cloud Cost Optimization and Data Platform Modernization"
date: "2026-03-04"
description: "How I led a FinOps-driven migration from fragmented on-prem stacks to a unified GCP data platform, delivering ~$2M annual savings with stronger governance and faster analytics."
category: "Proof of work"
tags: ["FinOps", "Cloud Migration", "BigQuery", "GCP", "Data Platform"]
---

## Executive Summary

I led this program as a business-critical platform transformation, not just an infrastructure migration. We moved from a fragmented on-prem model across VMware, OpenShift bare metal, OpenStack, and Hadoop toward a unified GCP operating model designed for cost transparency, product velocity, and governance at scale.

The outcome was material. We reduced annual platform cost from approximately $3.07M to $1.06M, which is about $2.1M in savings. At the same time, we improved utilization from around 35% to 75%, cut provisioning cycles from weeks to minutes, and enabled near real-time analytics access for 1200+ enterprise users.

## Business Context

The legacy platform was not failing from a pure reliability perspective. It was failing economically and operationally. Capacity was over-provisioned, ownership boundaries were unclear, and teams were spending too much time managing infrastructure instead of shipping outcomes.

From a product lens, this created three compounding issues. First, cost was opaque and hard to control. Second, data access was slow, which delayed decisions. Third, governance was uneven, which increased compliance and trust risk as usage scaled.

I framed the transformation around one core question: how do we improve decision velocity and data trust per dollar spent?

## Baseline and Outcome Data

| Metric | Before | After | Improvement |
| --- | --- | --- | --- |
| Annual platform cost | $3.07M | $1.06M | $2.1M saved (~76%) |
| Average utilization | ~35% | ~75% | ~114% efficiency lift |
| Provisioning time | 2 to 4 weeks | 5 to 15 minutes | ~99% faster |
| Data freshness | 24-hour batch | Near real-time | Operationally immediate |
| Platform operations staffing | 9 FTE | 3 FTE | ~67% reduction |
| Served users | Fragmented access | 1200+ users | Enterprise-scale self-service |

These metrics came from the project artifacts in the supplied `Cloud-cost-optimization-master` package and were used as steering KPIs during execution.

## Product Strategy I Used

I ran this as a phased product rollout with explicit risk controls and value checkpoints. The sequence was intentional.

Phase 0 focused on assessment, stakeholder alignment, and cost baselining. We mapped workloads, usage patterns, dependencies, and compliance requirements.

Phase 1 focused on quick wins and FinOps controls. We targeted obvious over-provisioning and introduced spend visibility, tagging discipline, and cost ownership by domain.

Phase 2 handled core workload migration into managed services, with automated validation and rollback paths.

Phase 3 delivered advanced capabilities including near real-time pipelines, broader self-service, and a stronger governance layer.

Phase 4 moved into continuous optimization with monthly KPI reviews and roadmap reprioritization based on actual usage.

This sequencing helped us protect business continuity while proving value early enough to maintain executive support.

## Target Architecture

The target state balanced four priorities: cost elasticity, secure scale, data accessibility, and operational simplicity.

```text
                    +-------------------------------------------+
                    |         Google Cloud Platform             |
                    |                                           |
                    |  Networking and Security                  |
                    |  - VPC hub-spoke                         |
                    |  - IAM and org policies                  |
                    |  - VPN / Interconnect                    |
                    |  - WAF / perimeter controls              |
                    |                                           |
                    |  Compute and Runtime                      |
                    |  - GKE Autopilot                         |
                    |  - Compute Engine (right-sized)          |
                    |  - Cloud Run for burst/serverless paths  |
                    |  - Preemptible VMs for batch economics   |
                    |                                           |
                    |  Data Platform                            |
                    |  - Cloud Storage (landing + tiering)     |
                    |  - Pub/Sub (event ingestion)             |
                    |  - Dataflow (stream + batch transforms)  |
                    |  - Composer (orchestration)              |
                    |  - BigQuery (curated enterprise marts)   |
                    |                                           |
                    |  Consumption                              |
                    |  - Looker dashboards                     |
                    |  - API products                           |
                    |  - ML workloads on curated datasets      |
                    +----------------------+--------------------+
                                           |
                             1200+ enterprise consumers
```

## Data Product Scope

We centered the delivery on five high-value enterprise datasets, including customer 360, billing events, network logs, IoT telemetry, and network performance domains. The goal was not only to migrate data, but to make it consumable through governed, reliable interfaces for analytics and product teams.

This was important because cost optimization alone does not create business value. Value came from combining cost efficiency with faster and safer data access.

## FinOps Operating Model

I implemented a chargeback-oriented operating model so cost became actionable at team and product level. Each domain had tagged ownership, budget guardrails, and monthly variance reviews tied to utilization and business demand.

This shifted the organization from reactive cost cutting to proactive cost-product planning. Teams could now decide tradeoffs with shared visibility into spend, performance, and customer impact.

## Risks and Mitigations

The highest risk was uncontrolled complexity during migration across multiple legacy stacks. I reduced that risk by sequencing migrations by business criticality and by defining a validation gate for every phase.

The second risk was adoption failure. We addressed this by onboarding users in waves and measuring active usage, query success, and delivery lead time instead of treating migration completion as success by itself.

The third risk was governance drift. We addressed this by codifying policy controls in platform workflows rather than relying on manual process.

## Business Impact

The transformation improved three executive-level outcomes.

Cost became predictable and materially lower.

Decision latency improved because data products became faster and fresher.

Platform trust improved because governance and accountability were built into the operating model.

For leadership, this changed the conversation from "how do we keep the platform running?" to "which business capabilities do we fund next on this platform?"

## What I Would Do Next

My next step would be to mature this into a continuous value engine with three tracks: streaming-first data products for priority domains, automated anomaly detection for unit economics, and ML-assisted optimization recommendations across compute, storage, and query patterns.

That would preserve the gains already achieved while compounding value through better product and financial decisions each quarter.
