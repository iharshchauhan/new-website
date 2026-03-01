---
title: "Sample Inputs: Report and PRD"
date: "2026-03-02"
description: "Example daily report and PRD artifacts that drive the autonomous loop."
---

# Sample Report
# Daily Report - 2024-01-15

## Key Metrics (24 hours)

| Metric | Value | Change |
|--------|-------|--------|
| Signups | 45 | -20% |
| Active Users | 1,234 | +5% |
| Revenue | $890 | -10% |
| Errors | 23 | +150% |

## Error Summary

### Top Errors (by frequency)

1. **TypeError: Cannot read property 'id' of undefined** (12 occurrences)
   - Location: `src/components/CheckoutForm.tsx:145`
   - Impact: Checkout flow broken for some users

2. **NetworkError: Request timeout** (8 occurrences)
   - Location: `src/api/payments.ts:78`
   - Impact: Payment processing delays

3. **ValidationError: Email format invalid** (3 occurrences)
   - Location: `src/utils/validation.ts:23`
   - Impact: Users with valid emails being rejected

## User Feedback (Last 24h)

- "I can't find the save button on mobile" - 3 reports
- "The checkout page keeps spinning" - 5 reports
- "Love the new dashboard!" - 2 reports
- "Password reset email never arrived" - 1 report

## Funnel Analysis

| Step | Users | Drop-off |
|------|-------|----------|
| Landing Page | 5,000 | - |
| Sign Up Start | 500 | 90% |
| Sign Up Complete | 45 | 91% |
| First Action | 30 | 33% |
| Upgrade Page | 10 | 67% |
| Payment Complete | 3 | 70% |

### Notable Drop-offs

- **Sign Up Start → Complete (91%)**: Form too long? Check mobile usability.
- **Upgrade Page → Payment (70%)**: Checkout errors likely causing abandonment.

## Performance

- Average page load: 2.3s (target: <2s)
- API response time: 180ms (target: <200ms)
- Uptime: 99.8%

## Recommendations

1. **URGENT**: Fix TypeError in CheckoutForm - blocking revenue
2. **HIGH**: Investigate save button visibility on mobile
3. **MEDIUM**: Relax email validation regex
4. **LOW**: Optimize page load time

## Ad Spend

| Campaign | Spend | Signups | CPL |
|----------|-------|---------|-----|
| Google Ads | $200 | 30 | $6.67 |
| Facebook | $150 | 15 | $10.00 |

Total: $350, 45 signups, $7.78 average CPL

# Sample PRD
# PRD: Fix Checkout Form TypeError

## Introduction

Fix the TypeError in CheckoutForm.tsx that is breaking the checkout flow for some users and causing revenue loss.

## Goals

- Eliminate the "Cannot read property 'id' of undefined" error
- Ensure checkout flow completes successfully for all users
- Add defensive coding to prevent similar errors

## Tasks

### T-001: Identify and fix the undefined 'id' access
**Description:** Locate line 145 in CheckoutForm.tsx, understand why the object is undefined, and add proper null checking.

**Acceptance Criteria:**
- [ ] Identify the object that can be undefined
- [ ] Add null/undefined check before accessing .id
- [ ] Error no longer appears in error logs
- [ ] npm run typecheck passes
- [ ] Verify in browser: complete a checkout flow successfully

### T-002: Add error boundary for checkout component
**Description:** Wrap the checkout form in an error boundary so future errors show a friendly message instead of crashing.

**Acceptance Criteria:**
- [ ] Create CheckoutErrorBoundary component
- [ ] Wrap CheckoutForm with error boundary
- [ ] Error boundary shows "Something went wrong, please try again" message
- [ ] Error boundary logs errors to monitoring service
- [ ] npm run typecheck passes
- [ ] Verify in browser: simulate error and see friendly message

### T-003: Add unit tests for checkout edge cases
**Description:** Add tests that cover the edge case where the object might be undefined.

**Acceptance Criteria:**
- [ ] Add test for undefined object scenario
- [ ] Add test for successful checkout flow
- [ ] All tests pass
- [ ] npm run typecheck passes

## Functional Requirements

- FR-1: CheckoutForm must handle cases where cart items have undefined properties
- FR-2: Users must see a friendly error message if checkout fails
- FR-3: Errors must be logged for debugging

## Non-Goals

- Not refactoring the entire checkout flow
- Not adding new checkout features
- Not changing the checkout UI design

## Technical Considerations

- The error occurs at line 145, likely when mapping over cart items
- Some cart items may have incomplete data from the API
- Consider using optional chaining (?.) for safety

## Success Metrics

- Zero TypeError occurrences in checkout flow
- Checkout completion rate improves by at least 5%
- No increase in average checkout time

## Open Questions

- Should we also add server-side validation for cart items?
- Is there an upstream API issue causing incomplete data?

