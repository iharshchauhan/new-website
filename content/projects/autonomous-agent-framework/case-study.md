---
title: "Case Study: Shipping Code While I Sleep"
date: "2026-03-02"
description: "Six months of real autonomous-agent usage data, outcomes, and lessons learned."
---
# How I Built an AI Agent That Ships Code While I Sleep

*Six months of running an autonomous Claude agent to implement side projects*

---

## The Problem

I have a lot of ideas. Too many, actually. My personal issue tracker was filling up with side projects, experiments, and "wouldn't it be cool if..." items that I never had time to build.

Most of these weren't complex—CLI tools, simple web apps, research spikes. The kind of thing that takes 2-4 hours of focused work. But I never had 2-4 hours of focused work available for side projects.

So I built an agent to do it for me.

---

## The System

The core loop is simple:

1. Every 30 minutes, scan my issue tracker for tasks labeled "automate"
2. Pick the highest-priority one
3. Run Claude in headless mode with the task description as a prompt
4. Update the issue with results and close it

The implementation has more nuance—research vs. implementation classification, process management, lock files—but that's the basic idea.

---

## Six Months of Data

From July 2025 to January 2026, the system processed **127 tasks**:

| Category | Count | Success Rate | Avg Duration |
|----------|-------|--------------|--------------|
| CLI Tools | 34 | 91% | 12 min |
| Research/Evaluation | 41 | 95% | 8 min |
| Simple Web Apps | 18 | 78% | 24 min |
| Config/Setup | 22 | 86% | 6 min |
| Complex Projects | 12 | 42% | 28 min |

**Overall success rate: 82%**

---

## What Works Well

### CLI Tools (91% success rate)

The agent excels at building CLI tools. The pattern is well-defined:
- Parse arguments
- Do some processing
- Output results

Example successes:
- A script to extract highlights from Readwise
- A tool to sync calendar events to my task tracker
- A formatter for converting markdown to specific formats

These tasks have clear inputs and outputs. The agent can test its work and iterate until it works.

### Research Tasks (95% success rate)

Research tasks—"Evaluate X for Y use case," "Compare A vs B," "Research best practices for Z"—have the highest success rate because they're read-only. The agent can't break anything.

The research/implementation classification was critical here. Without it, the agent would try to install and configure tools during research, often making a mess. With the classification, it just reads documentation and produces a recommendation.

### Configuration & Setup (86% success rate)

Tasks like "Set up launchd agent for X" or "Configure pre-commit hooks for Y" work well because:
1. The expected outcome is clear (a config file)
2. The agent can verify the result
3. Failures are non-destructive

---

## What Doesn't Work Well

### Complex Projects (42% success rate)

Tasks requiring multiple files, architectural decisions, or multi-step reasoning often fail. Examples:
- "Build a Chrome extension to X"
- "Create a full-stack app for Y"
- "Implement Z with proper error handling and tests"

The agent tends to:
1. Start confidently
2. Hit an unexpected complexity
3. Produce something that's 70% complete but broken
4. Time out before fixing it

For these, I now break them into smaller tasks or handle them myself.

### Tasks Requiring Human Judgment

"Design the UX for X" or "Write copy for Y" produce technically correct but uninspired results. The agent can implement a design, but it can't decide what the design should be.

### Tasks with External Dependencies

Anything requiring API keys, authentication, or external services tends to fail. The agent doesn't have access to my credentials (intentionally), so it produces code that would work if configured.

---

## Lessons Learned

### 1. Research Mode is Non-Negotiable

Early on, the agent would interpret "Research tool X" as "Install and configure tool X." I woke up one morning to find it had installed four different database engines while "researching" database options.

The research/implementation classification fixed this. Now research tasks get a prompt that explicitly says "DO NOT install anything."

### 2. Timeouts Need Process Tree Management

A 30-minute timeout on the parent process isn't enough. Claude spawns subprocesses (npm, git, etc.) that continue running after the parent is killed. I had zombie npm installs running for hours.

The fix: `spawn({detached: true})` creates a process group, and `process.kill(-pid)` kills the entire group.

### 3. Priority Selection Matters

Without priority guidance, the agent would pick tasks randomly. This meant it would spend time on "nice to have" items while urgent tasks sat in the queue.

I added a simple priority system (P0-P4) and a scoring function that considers dependencies. Now urgent tasks actually get processed first.

### 4. The Best Tasks Are Self-Verifying

Tasks where the agent can test its own work succeed at much higher rates. "Build a CLI that does X" is better than "Build a library for X" because the agent can run the CLI and see if it works.

For library tasks, I now always add "Include a test script that demonstrates usage."

### 5. Failures Are Learning Opportunities

Every failure produces a log. I review these weekly and often find patterns:
- "The agent keeps trying to use deprecated APIs" → Update prompt with version constraints
- "The agent doesn't handle edge cases" → Add explicit instructions about error handling
- "The agent produces working code but no documentation" → Add README requirement to prompt

The system improves over time as I encode these learnings.

---

## The Economic Argument

Is this worth it? Let's do the math.

**Costs:**
- Claude API usage: ~$30/month (about $0.25/task)
- My time maintaining the system: ~2 hours/month

**Value:**
- 127 tasks × 82% success rate × avg 2 hours saved = **~208 hours of work**

Even valuing my time at a modest $50/hour, that's **$10,400 of value from ~$180 in API costs and ~12 hours of maintenance**.

The ROI is absurd. And it keeps improving as I refine the prompts and task selection.

---

## What I'd Do Differently

### 1. Start with Research-Only

If I were building this again, I'd start with research tasks only. They have the highest success rate, and you learn how the agent thinks without risk of damage.

### 2. Better Task Decomposition

Many failures come from tasks that are too large. I'd invest more upfront in breaking tasks into atomic pieces that the agent can handle reliably.

### 3. Integration Testing

The agent can produce code that looks correct but doesn't integrate with the rest of my system. I'd add a step to verify outputs against integration tests before marking tasks complete.

### 4. Human Review Queue

Instead of auto-closing successful tasks, I'd add a human review step. Some "successes" are technically correct but not what I wanted. A 10-second review catch would prevent these.

---

## The Broader Pattern

This system isn't about replacing human work—it's about leveraging AI for the mechanical parts of building software while I focus on the parts that require judgment.

The agent handles:
- Boilerplate code
- Standard implementations
- Research and evaluation
- Configuration and setup

I handle:
- Architecture decisions
- UX design
- Integration strategy
- Quality review

Together, we're much more productive than either would be alone.

---

## Try It Yourself

The framework is open source. Start small:

1. Create a simple task queue (a folder with JSON files works)
2. Set up the agent with conservative settings (research mode only, 10-minute timeout)
3. Queue a few research tasks and review the output
4. Gradually expand to implementation tasks as you build confidence

The key is building trust incrementally. Don't hand over complex projects until you've seen how the agent handles simple ones.

---

## Questions I Still Have

- **Specialization vs. Generalization**: Would agents fine-tuned for specific task types perform better?
- **Multi-Agent Coordination**: Could multiple specialized agents work together on complex projects?
- **Learning from Failures**: Can the system automatically learn from its mistakes without my manual intervention?

If you're exploring similar questions, I'd love to hear about it.

---

*This case study accompanies the Autonomous Agent Framework. See the Outline for implementation details.*

