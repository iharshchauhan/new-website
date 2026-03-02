---
title: "Product Requirements Document"
date: "2026-03-02"
description: "PRD for dynamic pricing solution including personas and rollout."
---
# Product Requirements Document (PRD)
## AI Dynamic Pricing for India Coffee Shops

**Author:** Harsh Chauhan  
**Date:** November 2025  
**Status:** Portfolio Project → Production-Ready Concept  
**Target Market:** Indian Independent Coffee Shops (500-5,000 transactions/month)

---

## Executive Summary

India coffee shops lose an estimated ₹2-4k monthly in revenue by using static pricing that ignores demand signals. This AI-powered dynamic pricing system adjusts prices in real-time based on weather, time-of-day, and product type to capture willingness-to-pay during high-demand periods while maintaining customer trust through explainability.

**Key Metric:** 8-12% revenue lift without customer churn (validated via backtest simulation)

---

## 1. Problem Statement

### 1.1 Business Problem
Independent India coffee shops face margin pressure from rising costs (rent, labor, ingredients) but hesitate to raise prices due to customer sensitivity. Static menus leave money on the table during peak demand (cold rainy mornings, 8-9 AM commute) while potentially overcharging during slow periods.

### 1.2 User Pain Points

**Coffee Shop Owner:**
- "I know customers will pay more on cold mornings, but I can't change menus daily"
- "My POS system doesn't support time-based pricing"
- "I'm worried dynamic pricing will upset loyal customers"

**Operations Manager:**
- "How do I explain price changes to baristas?"
- "What if customers complain about different prices?"

**Finance Director:**
- "How do I justify dynamic pricing to franchisees?"
- "What's the ROI vs. risk of customer backlash?"

### 1.3 Market Opportunity
- **Target Market:** 25,000 independent coffee shops in India
- **Addressable Segment:** 5,000 shops with digital POS systems
- **Revenue Potential:** ₹2k-₹4k additional monthly revenue per shop
- **Total Opportunity:** ₹10M-₹20M annual revenue lift (at 5% penetration)

---

## 2. Solution Overview

### 2.1 Product Vision
An AI pricing engine that runs in the background, recommending optimal prices based on contextual signals, with full explainability for every recommendation to build stakeholder trust.

### 2.2 How It Works

**For Coffee Shop Owners:**
1. Integrate via API with existing POS system
2. System learns from 6-12 weeks of historical transaction data
3. Receives hourly price recommendations via dashboard
4. Can accept, reject, or modify recommendations
5. Views impact reports (revenue lift, customer satisfaction)

**Technical Architecture:**
- XGBoost model trained on historical transactions + weather data
- SHAP explainability layer for every price recommendation
- Confidence scoring (High/Medium/Low) guides manual override decisions
- Backtest engine validates recommendations before deployment

### 2.3 Key Differentiators
1. **Explainability-First:** Every price change comes with a "because..." explanation
2. **Human-in-the-Loop:** Owners control final pricing decisions
3. **India-Specific:** Weather integration via Open-Meteo API (Bengaluru focus)
4. **Ethical Design:** No surge pricing on essentials; caps at +15% above base price

---

## 3. User Personas

### Persona 1: Priya (Independent Coffee Shop Owner)
- **Age:** 34, runs 2 coffee shops in Bengaluru
- **Pain:** Thin margins, can't afford to lose regular customers
- **Goal:** Increase revenue without alienating loyal base
- **Tech Comfort:** Medium (uses Square POS, Instagram for marketing)
- **Decision Criteria:** "Will this make me more money without costing me customers?"

### Persona 2: James (Operations Manager, Chain of 10 Shops)
- **Age:** 42, manages operations for mid-size chain
- **Pain:** Staff confusion, inconsistent pricing across locations
- **Goal:** Standardize pricing strategy while capturing local demand patterns
- **Tech Comfort:** High (manages POS, inventory, scheduling software)
- **Decision Criteria:** "Can my team explain this to customers? Is it scalable?"

### Persona 3: Ananya (Finance Director, Franchise Network)
- **Age:** 48, oversees 30 franchisee locations
- **Pain:** Needs to justify pricing changes to franchise owners
- **Goal:** Prove ROI before rollout; minimize franchisee pushback
- **Tech Comfort:** Medium (Excel power user, reads basic SQL reports)
- **Decision Criteria:** "Show me the numbers. What's the risk?"

---

## 4. Success Metrics & OKRs

### 4.1 North Star Metric
**Revenue per Transaction (RPT)** - Must increase 8-12% without impacting transaction volume

### 4.2 Primary Metrics
| Metric | Baseline | Target (Month 3) | Measurement |
|--------|----------|------------------|-------------|
| Revenue Lift | 0% | +10% | Daily revenue vs. static pricing baseline |
| Customer Retention | 85% | 85% (maintain) | Monthly repeat customer rate |
| Price Acceptance Rate | N/A | 80% | % of AI recommendations accepted by owner |
| Complaint Rate | 2% | <3% | Customer complaints re: pricing per 1000 transactions |

### 4.3 Secondary Metrics
- **Model Performance:** RMSE < ₹0.20 on test set
- **Explainability Score:** 90%+ of owners understand SHAP explanations (survey)
- **System Uptime:** 99.5% availability
- **Recommendation Latency:** <500ms per prediction

### 4.4 Counter-Metrics (Guard Rails)
- Customer satisfaction score (CSAT) must stay ≥4.2/5
- Average basket size must not decrease >5%
- No single product can exceed +20% from base price

---

## 5. User Stories & Acceptance Criteria

### Epic 1: Core Pricing Engine

**Story 1.1:** As an **owner**, I want to **see hourly price recommendations** so that **I can decide whether to accept them**
- **AC1:** Dashboard shows next 4 hours of recommendations
- **AC2:** Each recommendation shows: predicted price, confidence (H/M/L), explanation
- **AC3:** One-click accept or manual override available

**Story 1.2:** As an **operations manager**, I want **price explanations in plain English** so that **baristas can answer customer questions**
- **AC1:** Each price change has a printable "staff guide" (e.g., "₹0.30 higher due to cold morning + high demand")
- **AC2:** Explanation uses <20 words, no technical jargon
- **AC3:** Includes suggested customer response script

### Epic 2: Explainability & Trust

**Story 2.1:** As a **finance director**, I want to **see SHAP waterfall charts** so that **I can audit pricing logic**
- **AC1:** Clicking any recommendation opens detailed SHAP breakdown
- **AC2:** Shows: base price → feature contributions → final price
- **AC3:** Export to PDF for board presentations

**Story 2.2:** As an **owner**, I want to **set maximum price caps** so that **I maintain brand positioning**
- **AC1:** Can set global cap (e.g., no price >₹5.00 for any coffee)
- **AC2:** Can set product-specific caps (e.g., flat white max ₹4.50)
- **AC3:** System respects caps; shows "capped" label on recommendations

### Epic 3: Monitoring & Learning

**Story 3.1:** As an **owner**, I want to **see daily impact reports** so that **I know if dynamic pricing is working**
- **AC1:** Daily email/dashboard showing: revenue vs. baseline, top revenue-generating time slots, customer feedback summary
- **AC2:** Weekly report comparing projected vs. actual revenue lift
- **AC3:** Monthly A/B test summary (dynamic vs. static pricing performance)

---

## 6. Technical Requirements

### 6.1 Functional Requirements
- **FR1:** Ingest transaction data via CSV upload or API integration (Square, Shopify POS, Lightspeed)
- **FR2:** Fetch real-time weather data (Open-Meteo API)
- **FR3:** Generate price recommendations every hour (batch) or on-demand (API call)
- **FR4:** Store model explainability artifacts (SHAP values) for audit trail
- **FR5:** Support manual override with reason logging

### 6.2 Non-Functional Requirements
- **NFR1:** Model retraining: Weekly (automatic) with human validation
- **NFR2:** API response time: <500ms for single prediction
- **NFR3:** Dashboard load time: <2 seconds
- **NFR4:** GDPR compliance: All personal data anonymized; 30-day audit log retention
- **NFR5:** Scalability: Support 10,000 requests/hour per shop

### 6.3 Data Requirements
- **Minimum Viable Data:** 3 months of historical transactions (recommended: 12 months)
- **Required Fields:** Date, Time, Product, Price, Quantity
- **Optional Fields:** Customer ID (anonymized), Payment method, Location
- **External Data:** Weather (temperature, precipitation, cloud cover)

---

## 7. Go-to-Market Strategy

### 7.1 Launch Plan (Phased Rollout)

**Phase 0: Portfolio Demo (Current)**
- Streamlit app with simulated data
- Target: Showcase to recruiters, interview portfolio

**Phase 1: Pilot (3 months)**
- Partner with 5 independent Bengaluru coffee shops
- Free service in exchange for data + testimonials
- Weekly check-ins, manual overrides allowed
- Success criteria: 8%+ revenue lift, <5% customer complaints

**Phase 2: Beta (6 months)**
- 20-50 paying customers (₹99/month subscription)
- Self-service onboarding via web app
- Email support + monthly business reviews
- Build case studies for marketing

**Phase 3: Scale (12 months)**
- Target 500 customers across India
- Tiered pricing: Starter (₹99), Pro (₹199), Enterprise (custom)
- Partner with POS providers (Square, Shopify)
- Hire customer success team

### 7.2 Pricing Model (Future State)
- **Starter:** ₹99/month - Single location, email support
- **Pro:** ₹199/month - Up to 5 locations, priority support, custom caps
- **Enterprise:** Custom - 10+ locations, API access, dedicated CSM

### 7.3 Key Partnerships
- **POS Systems:** Square, Shopify POS, Lightspeed (API integrations)
- **Trade Associations:** India Coffee Association (credibility, distribution)
- **Data Providers:** Open-Meteo (weather), Google Places API (foot traffic)

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Customer backlash against dynamic pricing | Medium | High | Lead with explainability; cap price increases at +15%; A/B test messaging |
| Model drift (seasonal patterns change) | High | Medium | Weekly retraining; confidence scoring; human-in-loop overrides |
| Competitor copies model | Medium | Low | Focus on explainability + India localization as moat; build brand trust |
| POS integration complexity | High | High | Start with CSV upload MVP; partner with 1-2 POS providers for deep integration |
| GDPR compliance issues | Low | High | Anonymize all data; EU hosting; legal review before launch |

---

## 9. Ethical Considerations

### 9.1 Fairness & Bias
- **Concern:** Algorithm could discriminate based on proxy variables (e.g., location as proxy for demographics)
- **Mitigation:** SHAP audit for protected attributes; monthly bias testing; exclude location-based features in v1

### 9.2 Transparency
- **Concern:** "Black box" pricing erodes customer trust
- **Mitigation:** SHAP explanations for every price; public FAQ on website; "Why this price?" button in app

### 9.3 Consumer Protection
- **Concern:** Surge pricing on essentials could harm vulnerable customers
- **Mitigation:** Price caps (+15% max); no dynamic pricing on basic items (filter coffee stays fixed); low-income discount program

### 9.4 Responsible AI Checklist (Completed)
- ☑ Model explainability implemented (SHAP)
- ☑ Bias audit conducted (no demographic proxy features)
- ☑ Human oversight required (owner approval loop)
- ☑ Data privacy compliant (India DPDP Act, 2023)
- ☑ Rollback plan (can revert to static pricing in <1 hour)

---

## 10. Open Questions & Future Roadmap

### 10.1 Open Questions (Needs Research)
1. What's the optimal price change frequency? (Hourly? Daily? Dynamic throughout day?)
2. How do customers perceive "fair" price variation? (Survey needed)
3. Which product categories have highest price elasticity? (A/B test needed)
4. Can we predict foot traffic using Google Maps API? (Prototype needed)

### 10.2 Future Features (Post-MVP)
- **V2:** Personalized pricing (loyalty members get stable prices)
- **V3:** Competitor price monitoring (adjust based on nearby cafes)
- **V4:** Inventory-aware pricing (discount items expiring soon)
- **V5:** Predictive ordering (suggest inventory purchases based on forecasted demand)

---

## 11. Appendix

### 11.1 References
- Prediction Machines (Agrawal, Gans, Goldfarb) - Decision-making under uncertainty
- The AI Product Manager's Handbook - Explainability as product requirement
- Applied Artificial Intelligence (Leong Chan) - Adoption gap framework

### 11.2 Related Documents
- `METRICS.md` - Detailed metrics framework
- `ETHICS.md` - Responsible AI audit
- `BACKTEST_METHODOLOGY.md` - How we validated 8-12% revenue lift
- `SHAP_EXPLAINABILITY_GUIDE.md` - For technical stakeholders

---

**Document Owner:** Harsh Chauhan  
**Last Updated:** November 26, 2025  
**Review Cycle:** Monthly (or as product evolves)  
**Stakeholders:** Product, Engineering, Finance, Legal, Customer Success

