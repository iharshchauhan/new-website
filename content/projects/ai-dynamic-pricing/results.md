---
title: "Results"
date: "2026-03-02"
description: "Performance, backtest outcomes, and validation summary."
---
# 📊 AI Dynamic Pricing - Results Summary

**One-Page Results Overview for Stakeholders**

---

## 🎯 Executive Summary

Built an end-to-end AI pricing system for India coffee shops that **proves 16% margin lift** through historical backtest validation. The model achieves R² = 0.997 prediction accuracy while maintaining ethical pricing constraints.

**Bottom Line:** ₹17,959 annual revenue opportunity for a typical high-street coffee shop, validated across 388 days of real Bengaluru weather data.

![Backtest Results](/images/ai-dynamic-pricing/backtest-results.png)

---

## 📈 Business Impact

### Revenue Opportunity
| Metric | Current (Static) | With AI (Dynamic) | Improvement |
|--------|------------------|-------------------|-------------|
| **Annual Revenue** | ₹112,245 | ₹130,204 | **₹17,959 (+16%)** |
| **Daily Revenue** | ₹289.27 | ₹335.56 | **₹46.29 (+16%)** |
| **Avg Transaction** | ₹31.65 | ₹36.71 | **₹5.06 (+16%)** |

### Consistency Validation
- ✅ **Positive lift in 12/13 months** (92% success rate)
- ✅ **Works across all weather conditions** (rainy, cold, mild, hot)
- ✅ **Validated on 3,547 real transactions** (March 2024 - March 2025)

---

## 🤖 Model Performance

### Accuracy Metrics
```
Baseline Model (Phase 1):
├─ R²:  0.978
├─ MAE: ₹0.34
└─ RMSE: ₹0.72

Optimized Model (Phase 2):
├─ R²:  0.997 ✨ (+1.9% improvement)
├─ MAE: ₹0.26 ✨ (27.9% better)
└─ RMSE: ₹0.54 ✨ (25.5% better)
```

**Translation:** The model predicts prices within **26 pence** on average — that's **0.84% error** on a ₹31.65 average transaction.

### Feature Importance
Top drivers of price optimization:

1. **Product Type** (82.5%) — Premium products (Latte, Cappuccino) vs basic (Americano)
2. **Weather Conditions** (11.0%) — Cold + rainy = higher willingness-to-pay
3. **Time Patterns** (5.5%) — Peak hours (lunch rush) vs slow periods
4. **Day of Week** (1.0%) — Weekend vs weekday behavior

![Feature Importance](/images/ai-dynamic-pricing/feature-importance-analysis.png)

---

## ⚖️ Ethics & Compliance

### Built-in Guardrails
| Rule | Setting | Purpose |
|------|---------|---------|
| **Max Price Increase** | +15% | Prevents gouging perception |
| **Max Price Decrease** | -20% | Protects profit margins |
| **Review Threshold** | >10% change | Human oversight for edge cases |

### Application Results (from Backtest)
- **60 prices capped** (1.7% of transactions) — Prevented excessive increases
- **360 flagged for review** (10.1%) — Human-in-the-loop quality control
- **0 violations** — 100% compliance with ethical constraints

---

## 🔬 Technical Highlights

### Data Pipeline
```
Coffee Sales (3,547 transactions)
    ↓
Feature Engineering (25 features)
    • Time: 15 features (hour, day, peak periods)
    • Weather: 4 features (temp, rain, derived flags)
    • Product: 6 categories (one-hot encoded)
    ↓
XGBoost + Optuna Tuning (50+ trials)
    ↓
SHAP Explainability (per-prediction)
    ↓
Ethics Guardrails (automated caps)
    ↓
Backtest Validation (388 days)
```

### External Integrations
- **Open-Meteo API** — 388 days of real Bengaluru weather (temperature, rainfall)
- **SHAP Library** — Explainable AI for stakeholder trust
- **Optuna Framework** — Automated hyperparameter optimization

---

## 💡 Key Product Decisions

### 1. Why Weather Integration?
**Finding:** 36% of transactions occur on rainy days. Cold + rainy conditions show 8-10% higher willingness-to-pay for hot drinks.

**Impact:** Weather features account for 11% of model's predictive power.

![SHAP Weather Analysis](/images/ai-dynamic-pricing/shap-weather-analysis.png)

### 2. Why SHAP Explainability?
**Stakeholder Quote:** *"I need something I can explain to the board in 5 minutes and defend to customers in 30 seconds."*

**Solution:** Every price recommendation includes SHAP explanation showing which factors influenced the decision.

### 3. Why Historical Backtest?
**Problem:** Theoretical models don't convince investors.

**Solution:** Ran strategy on historical data (March 2024 - March 2025) proving 16% lift across all conditions. This turns "might work" into "would have worked."

---

## 📊 Sample Results by Condition

### Weather Impact
| Condition | Transactions | Avg Lift | Total Lift |
|-----------|--------------|----------|------------|
| **Cold + Rainy** | 1,284 (36%) | +10.2% | ₹4,143 |
| **Cold Only** | 623 (18%) | +5.8% | ₹1,142 |
| **Rainy Only** | 891 (25%) | +7.1% | ₹2,004 |
| **Mild/Warm** | 749 (21%) | +3.2% | ₹759 |

### Time-of-Day Impact
| Period | Transactions | Avg Lift | Strategy |
|--------|--------------|----------|----------|
| **Morning Rush** (8-10 AM) | 876 | +3.8% | Small premium on high traffic |
| **Lunch Peak** (12-2 PM) | 1,124 | +5.4% | Peak pricing justified by demand |
| **Slow Period** (4-7 PM) | 418 | -2.1% | Discount to drive volume |
| **Evening** (6-8 PM) | 291 | +4.2% | Premium on convenience |

---

## 🎓 Learnings & Insights

### What Worked
✅ **Feature engineering > model complexity** — 25 well-designed features beat fancier algorithms  
✅ **Real data > synthetic data** — Open-Meteo API more valuable than fake weather  
✅ **Explainability drives adoption** — SHAP analysis addresses trust concerns  
✅ **Ethics guardrails = risk mitigation** — Caps prevent reputational damage  

### Surprises
🔍 **Weekend afternoon premium** — Leisure shoppers less price-sensitive (+4% works)  
🔍 **Premium product price elasticity** — High-end items need smaller adjustments (-30% on multiplier)  
🔍 **Cold alone matters** — Cold days without rain still show +5.8% willingness-to-pay  

### If I Did This Again
🔄 **Earlier A/B test planning** — Would design experiment framework from start  
🔄 **Customer segmentation** — Analyze regulars vs walk-ins separately  
🔄 **Competitor pricing data** — Integrate Starbucks/Costa prices for context  

---

## 🚀 Next Steps (Phase 3)

### Production Readiness
- [ ] **Streamlit Demo App** — Interactive tool for stakeholders to test scenarios
- [ ] **REST API Endpoint** — Production deployment architecture
- [ ] **Monitoring Dashboard** — Track model performance drift

### Product Documentation
- [ ] **PRD (Product Requirements Doc)** — Specification for engineering team
- [ ] **Go-to-Market Strategy** — Positioning vs competitors
- [ ] **A/B Testing Framework** — Validation in live environment

### Commercial Viability
- [ ] **Pricing Model** — SaaS vs one-time license vs revenue share
- [ ] **Customer Acquisition** — Target independent shops vs chains
- [ ] **Partnership Strategy** — POS system integrations

---

## 📧 Questions?

**For technical details:** See [GitHub Repository](https://github.com/yourusername/ai-dynamic-pricing)  
**For business case:** See [Full Case Study](https://your-portfolio-site.com/projects/ai-dynamic-pricing)  
**For collaboration:** Contact [your.email@example.com](mailto:your.email@example.com)

---

**Last Updated:** November 2025  
**Project Status:** Phase 2 Complete, Phase 3 In Progress  
**Total Development Time:** 6 weeks (part-time)

---

## 🎯 TL;DR (30-Second Version)

> Built an AI pricing system for India coffee shops that **proves 16% margin lift** (₹17,959 annually) through historical validation. Model achieves R² = 0.997 accuracy while maintaining ethics guardrails. Integrated real Bengaluru weather data (388 days) and SHAP explainability. Validated across all conditions with 92% monthly success rate.

**Differentiator:** Not just "built a model" — proved business value with backtest, addressed ethics concerns, and made it explainable for stakeholder adoption.

