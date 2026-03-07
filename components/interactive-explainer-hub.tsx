"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ExplainerTopic = {
  slug: string;
  title: string;
  description: string;
  path: string;
};

const TOPICS: ExplainerTopic[] = [
  {
    slug: "llm-fundamentals",
    title: "LLM Fundamentals",
    description: "How LLMs are trained, how inference works, and where models fail.",
    path: "llm-fundamentals/index.html",
  },
  {
    slug: "context-windows",
    title: "Context Windows and Memory",
    description: "Token limits, memory patterns, and retrieval-driven continuity.",
    path: "context-windows/index.html",
  },
  {
    slug: "cost-latency",
    title: "Cost and Latency",
    description: "Tradeoffs between speed, quality, and unit economics.",
    path: "cost-latency/index.html",
  },
  {
    slug: "grounding",
    title: "Grounding and Guardrails",
    description: "RAG, reliability boundaries, and safety controls.",
    path: "grounding/index.html",
  },
  {
    slug: "evaluation",
    title: "Evaluation and Testing",
    description: "Practical methods to measure AI quality before shipping.",
    path: "evaluation/index.html",
  },
  {
    slug: "agents",
    title: "Agents and Tool Use",
    description: "Agent loops, function calls, and orchestration patterns.",
    path: "agents/index.html",
  },
  {
    slug: "ai-ux",
    title: "AI UX and Human Oversight",
    description: "Designing for uncertainty and human-in-the-loop controls.",
    path: "ai-ux/index.html",
  },
  {
    slug: "vibe-coding",
    title: "Vibe Coding",
    description: "Hands-on PM workflow for building with AI coding tools.",
    path: "vibe-coding/index.html",
  },
];

export function InteractiveExplainerHub() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [activeSlug, setActiveSlug] = useState<string>(TOPICS[0].slug);

  const activeTopic = useMemo(() => {
    return TOPICS.find((topic) => topic.slug === activeSlug) || TOPICS[0];
  }, [activeSlug]);

  const iframeSrc = `${basePath}/interactive-explainers/${activeTopic.path}`;

  return (
    <section className="space-y-6 rounded-3xl border border-border bg-card p-5 sm:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Interactive Framework Hub</h2>
        <p className="text-muted-foreground">
          Select a topic to preview the interactive explainer. Each module keeps the original
          CSS system and behavior from the source package.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => {
          const isActive = topic.slug === activeTopic.slug;
          return (
            <button
              key={topic.slug}
              onClick={() => setActiveSlug(topic.slug)}
              className={
                isActive
                  ? "rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  : "rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              }
            >
              {topic.title}
            </button>
          );
        })}
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium">{activeTopic.title}</h3>
            <p className="text-sm text-muted-foreground">{activeTopic.description}</p>
          </div>
          <Link
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Open full module
          </Link>
        </div>

        <iframe
          src={iframeSrc}
          title={`${activeTopic.title} interactive module`}
          className="h-[520px] w-full rounded-xl border border-border bg-white"
        />
      </div>
    </section>
  );
}
