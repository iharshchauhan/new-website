---
title: "How I think about moving from on-prem infrastructure to a GCP platform"
date: "2026-03-04"
description: "A product and platform perspective on evolving from fragmented on-prem systems to a structured GCP architecture with cost attribution and chargeback."
category: "Proof of work"
tags: ["Cloud", "Platform Engineering", "GCP", "Architecture", "FinOps"]
---

My goal with architecture discussions is always the same. I want the platform to scale without constant intervention from infrastructure teams. I want engineers to ship services quickly while still maintaining governance, cost visibility, and security. When organizations move from traditional on-prem environments to cloud platforms, architecture decisions become product decisions.

The diagrams below reflect how I typically frame that journey. I start by understanding the current state deeply. Then I define a target platform architecture that removes operational friction while introducing strong platform guardrails. Finally, I design a cost attribution and chargeback model so teams understand how their infrastructure usage translates into spend.

## Project context and vision

This platform transformation usually begins with a clear business goal. In this case the objective is to evolve a fragmented on-prem infrastructure into a unified cloud data platform that supports self service analytics, real time insights, and scalable product development.

The current environment reflects a typical enterprise pattern. Infrastructure has grown over time through multiple platforms, manual operational processes, and isolated data environments across many departments. As a result, infrastructure cost increases while developer productivity and data accessibility decline.

| Current Challenge | Impact |
| --- | --- |
| Infrastructure cost exceeding $2M annually | High operational overhead and inefficient capacity usage |
| Average compute utilization around 35% | Significant idle infrastructure capacity |
| Software licensing consuming ~25% of IT budget | Vendor lock-in and high fixed costs |
| Data silos across 15+ departments | Limited cross-functional insights |

Beyond cost, operational complexity also becomes a limiting factor. Environment provisioning can take multiple weeks, infrastructure scaling requires manual intervention, and platform operations depend on a small infrastructure team.

| Operational Constraint | Typical Outcome |
| --- | --- |
| 9 FTEs managing infrastructure | High operational burden |
| 2-4 weeks environment provisioning | Slower product delivery |
| Manual scaling and backups | Increased operational risk |

These issues create the foundation for the platform redesign.

## The current state: fragmented infrastructure layers

Most enterprises I work with operate a hybrid on-prem environment that grew organically over time. Different teams adopt different infrastructure stacks depending on their needs.

| Platform Layer | Technologies | Operational Reality |
| --- | --- | --- |
| Virtualization | VMware (vCenter, ESXi hosts) | Traditional VM workloads and legacy services |
| Container Platform | OpenShift bare metal clusters | Modern containerized services |
| Private Cloud | OpenStack | Internal IaaS workloads |

Each of these platforms solves a real problem, but they introduce fragmentation. Networking models differ. Provisioning workflows differ. Cost visibility is limited. Infrastructure teams spend significant time integrating systems rather than enabling developers.

This environment usually produces several systemic inefficiencies which become visible once we analyze the infrastructure platform by platform.

### Cross-platform infrastructure utilization

A detailed assessment across VMware, OpenShift bare metal, and OpenStack environments typically reveals similar patterns of over-provisioning and inefficient resource usage.

| Platform | Typical Observation |
| --- | --- |
| VMware | Large number of underutilized virtual machines |
| OpenShift | Containers requesting more CPU and memory than they use |
| OpenStack | Instance flavors larger than required for workloads |

The result is consistent across environments. CPU utilization remains low, memory is frequently over-allocated, and infrastructure capacity remains idle while still generating cost.

### Infrastructure platform fragmentation

| Platform | Primary Role | Operational Characteristics |
| --- | --- | --- |
| VMware | Legacy virtualization workloads | Traditional VM lifecycle management |
| OpenShift | Containerized application platform | Bare metal cluster operations |
| OpenStack | Internal private cloud | Self-managed infrastructure services |

Operating multiple infrastructure control planes increases operational complexity significantly. Each platform requires separate expertise, monitoring tools, provisioning workflows, and capacity planning processes.

From a platform engineering perspective, the organization is effectively maintaining three separate infrastructure platforms instead of one unified cloud platform.

These architectural conditions lead to three common symptoms.

| Symptom | What I observe |
| --- | --- |
| Slow environment provisioning | Teams wait days or weeks for infrastructure requests |
| Limited cost visibility | Costs exist but are difficult to attribute to teams or services |
| Platform duplication | Similar capabilities implemented multiple times |

From a product perspective, the platform itself becomes difficult to operate and difficult to evolve.

## The target state: a structured GCP platform

The goal of the target architecture is not simply cloud migration. The goal is to establish a clear platform model that developers can rely on.

At the infrastructure level, Google Cloud becomes the control plane for networking, compute, identity, and security.

| Platform Layer | Key Components | Platform Outcome |
| --- | --- | --- |
| Networking and Security | VPC hub-spoke architecture, Cloud Armor, IAM, Org Policies | Centralized network and policy control |
| Compute and Containers | GKE clusters and managed compute | Standardized runtime for applications |
| Data and Storage | Cloud SQL, BigQuery, object storage | Managed data infrastructure |

This structure gives us several advantages immediately.

First, networking becomes predictable. The hub-spoke VPC model creates a centralized networking layer where shared services such as security inspection, connectivity, and logging can be managed once instead of repeatedly.

Second, identity and policy enforcement become consistent across the platform. IAM and organization policies allow governance to be expressed as platform rules rather than operational processes.

Third, infrastructure becomes programmable. Developers interact with the platform through infrastructure as code and automated pipelines instead of ticket-based workflows.

## Designing the platform around developer experience

When I design a cloud platform, I treat the developer workflow as the primary interface.

| Developer Need | Platform Capability |
| --- | --- |
| Fast environment creation | Automated project and namespace provisioning |
| Secure service deployment | Preconfigured networking and identity policies |
| Reliable runtime | Managed Kubernetes clusters and autoscaling |

The goal is not simply to run workloads in the cloud. The goal is to create a platform where teams can build and operate services without needing to understand every infrastructure layer underneath.

## Cost attribution and chargeback

Once infrastructure moves into the cloud, cost transparency becomes essential. Without a clear cost model, cloud adoption quickly leads to uncontrolled spending and difficult conversations with finance teams.

The foundation of the model starts with GCP billing exports.

| Step | Description |
| --- | --- |
| Billing export | Raw usage data exported from GCP billing |
| Cost attribution engine | Logic that maps resource usage to services, teams, or environments |
| Chargeback reporting | Internal dashboards showing team level cost consumption |

The cost attribution layer becomes the bridge between infrastructure usage and financial accountability.

Instead of treating cloud costs as a single operational expense, we distribute costs based on actual usage patterns.

| Cost Dimension | Example Attribution |
| --- | --- |
| Project | Application or product team |
| Environment | Production, staging, development |
| Service | Individual microservice or platform capability |

This model enables internal chargeback or showback depending on the organization's financial maturity.

## Product delivery model

Large platform transformations require a clear product delivery structure. Instead of treating this purely as an infrastructure migration, I structure the initiative as a platform product with defined stakeholders and delivery teams.

### Stakeholder model

| Stakeholder | Responsibility |
| --- | --- |
| CFO | Financial oversight and ROI validation |
| VP Engineering | Execution ownership and delivery alignment |
| Product Owner | Strategy, prioritization, and roadmap management |
| Cloud Architect | Architecture design and migration patterns |
| Data Engineers | Data pipelines and modeling |
| FinOps Lead | Cost attribution and optimization |
| SRE / DevOps | Platform reliability and automation |

The platform ultimately supports more than a thousand internal users across multiple business functions including network operations, finance, marketing, and product teams.

## Product roadmap and epics

Once the architecture direction is defined, the work is broken into epics and features across infrastructure, data platform, governance, and developer enablement tracks.

| Epic Category | Example Capabilities |
| --- | --- |
| Cloud foundation | Organization structure, networking, IAM |
| Platform services | Kubernetes platform, CI/CD, observability |
| Data platform | Data pipelines, warehouse, governance |
| FinOps | Cost attribution, chargeback dashboards |
| Developer experience | Self-service environments and automation |

## Implementation roadmap

The delivery roadmap typically progresses through multiple maturity stages as the platform capabilities expand.

| Phase | Objective | Key Deliverables |
| --- | --- | --- |
| Phase 1 | Cloud foundation | Networking, IAM, project structure |
| Phase 2 | Platform compute layer | GKE clusters and workload migration |
| Phase 3 | Data platform | Analytics infrastructure and pipelines |
| Phase 4 | FinOps and governance | Cost attribution and chargeback |
| Phase 5 | Platform maturity | Self-service platform capabilities |

## How I roll this out

Large platform transformations rarely succeed if we try to redesign everything at once. I approach the rollout in structured phases.

| Phase | Objective | Platform Focus |
| --- | --- | --- |
| Phase 1 | Establish cloud foundation | Networking, IAM, and project structure |
| Phase 2 | Standardize compute platform | GKE clusters and workload migration |
| Phase 3 | Introduce cost attribution | Billing export and attribution engine |
| Phase 4 | Platform maturity | Automation, developer self-service, governance |

Each phase delivers immediate value while setting up the next layer of the platform.

## What I measure

Architecture only matters if it improves how the platform operates. I evaluate success through operational metrics rather than architectural diagrams.

| Metric | Why it matters |
| --- | --- |
| Environment provisioning time | Measures developer productivity |
| Infrastructure utilization | Indicates platform efficiency |
| Cost visibility by team | Ensures financial accountability |
| Deployment frequency | Signals platform usability |

If those metrics improve, the architecture is working.

## Closing

Platform architecture should not be designed purely as infrastructure diagrams. It should be designed as an operational product that developers rely on every day.

By moving from fragmented on-prem environments to a structured cloud platform, we reduce operational complexity, improve developer velocity, and introduce clear cost accountability.

That combination ultimately turns infrastructure from a bottleneck into an enabler of product development.
