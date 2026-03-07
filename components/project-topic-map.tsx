import Link from "next/link";
import { ArrowRight, CircleDot } from "lucide-react";
import type { ProjectTopicItem } from "@/lib/project-navigation";
import { getProjectSubpageHref, groupProjectTopics } from "@/lib/project-navigation";
import { cn } from "@/lib/utils";
import {
  getInteractiveExplainerAsset,
  INTERACTIVE_EXPLAINERS_OVERVIEW_PATH,
} from "@/lib/interactive-explainers";

type ProjectTopicMapProps = {
  projectSlug: string;
  items: ProjectTopicItem[];
  currentSubpage?: string;
  className?: string;
};

export function ProjectTopicMap({
  projectSlug,
  items,
  currentSubpage,
  className,
}: ProjectTopicMapProps) {
  const groupedTopics = groupProjectTopics(items);
  const isInteractiveFramework = projectSlug === "interactive-explainers-framework";
  const overviewHref = isInteractiveFramework
    ? INTERACTIVE_EXPLAINERS_OVERVIEW_PATH
    : `/projects/${projectSlug}`;

  return (
    <aside
      className={cn(
        "rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(250,246,235,0.96)_0%,rgba(243,238,222,0.92)_100%)] p-5 shadow-[0_22px_60px_rgba(44,72,62,0.08)] backdrop-blur-sm md:p-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto",
        className,
      )}
    >
      <div className="space-y-2 border-b border-border/50 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground/90">
          Topic Map
        </p>
        <Link
          href={overviewHref}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[1rem] font-semibold transition-all",
            currentSubpage
              ? "border-border/60 bg-white/60 text-foreground hover:bg-white"
              : "border-primary/30 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
          )}
        >
          <CircleDot className="h-3.5 w-3.5" />
          Overview
        </Link>
      </div>

      <div className="space-y-6 pr-1">
        {groupedTopics.map(({ group, topics }) => (
          <section key={group} className="space-y-3">
            {group !== "Topics" && (
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground/90">
                {group}
              </h3>
            )}
            <div className="space-y-2.5">
              {topics.map((item) => {
                const isActive = currentSubpage === item.slug;
                const explainerAsset = isInteractiveFramework
                  ? getInteractiveExplainerAsset(item.slug)
                  : null;
                const href = explainerAsset?.publicPath || getProjectSubpageHref(projectSlug, item.slug);

                return (
                  <Link
                    key={item.slug}
                    href={href}
                    className={cn(
                      "group block rounded-[1.35rem] border px-4 py-3.5 transition-all duration-200",
                      isActive
                        ? "border-primary/35 bg-[linear-gradient(180deg,rgba(71,170,150,0.14)_0%,rgba(71,170,150,0.08)_100%)] shadow-[0_10px_28px_rgba(58,159,138,0.12)]"
                        : "border-border/50 bg-white/60 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white hover:shadow-[0_14px_32px_rgba(44,72,62,0.08)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "text-[1.02rem] font-semibold leading-snug",
                            isActive ? "text-primary" : "text-foreground",
                          )}
                        >
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground/95 leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 mt-0.5 shrink-0 transition-transform",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5",
                        )}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
