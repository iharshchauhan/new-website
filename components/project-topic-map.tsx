import Link from "next/link";
import { ArrowRight, CircleDot } from "lucide-react";
import type { ProjectTopicItem } from "@/lib/project-navigation";
import { getProjectSubpageHref, groupProjectTopics } from "@/lib/project-navigation";
import { cn } from "@/lib/utils";

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

  return (
    <aside
      className={cn(
        "rounded-2xl border border-white/60 bg-[#f5f4eb]/85 p-5 md:p-6 space-y-5",
        className,
      )}
    >
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Topic Map
        </p>
        <Link
          href={`/projects/${projectSlug}`}
          className={cn(
            "inline-flex items-center gap-2 text-base font-semibold transition-colors",
            currentSubpage ? "text-muted-foreground hover:text-foreground" : "text-primary",
          )}
        >
          <CircleDot className="h-3.5 w-3.5" />
          Overview
        </Link>
      </div>

      <div className="space-y-5">
        {groupedTopics.map(({ group, topics }) => (
          <section key={group} className="space-y-2.5">
            {group !== "Topics" && (
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {group}
              </h3>
            )}
            <div className="space-y-2">
              {topics.map((item) => {
                const isActive = currentSubpage === item.slug;
                return (
                  <Link
                    key={item.slug}
                    href={getProjectSubpageHref(projectSlug, item.slug)}
                    className={cn(
                      "group rounded-xl border px-3.5 py-3 transition-all block",
                      isActive
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/50 bg-white/55 hover:border-primary/25 hover:bg-white/85",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <p
                          className={cn(
                            "text-base font-semibold leading-snug",
                            isActive ? "text-primary" : "text-foreground",
                          )}
                        >
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
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
