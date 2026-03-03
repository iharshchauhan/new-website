import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { ArrowRight } from "lucide-react";
import { CTASection } from "@/components/ui/hero-dithering-card";

export default function Home() {
  const writingPosts = getAllPosts("writing");
  const projectPosts = getAllPosts("projects");
  
  const recentPosts = [...writingPosts, ...projectPosts]
    .sort((a, b) => (a.meta.date > b.meta.date ? -1 : 1))
    .slice(0, 5);

  return (
    <div className="space-y-24">
      <CTASection />

      <div className="space-y-16">
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-medium">Recent from Logbook</h2>
            <Link
              href="/logbook"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
            >
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-8">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.type}/${post.slug}`}
                className="block group"
              >
                <article className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-medium group-hover:text-primary transition-colors underline-offset-4 group-hover:underline flex items-center gap-3">
                      {post.meta.title}
                      <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono text-muted-foreground no-underline">
                        {post.meta.category}
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono shrink-0 ml-4 hidden sm:block">
                      {new Date(post.meta.date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-muted-foreground line-clamp-2">
                    {post.meta.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
