import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { ArrowRight } from "lucide-react";
import { CTASection } from "@/components/ui/hero-dithering-card";
import { getSpotifyHomeData } from "@/lib/spotify";
import { ListeningsSection } from "@/components/listenings-section";

export default async function Home() {
  const writingPosts = getAllPosts("writing");
  const spotifyData = await getSpotifyHomeData();

  const recentPosts = writingPosts.slice(0, 6);

  return (
    <div className="space-y-24">
      <CTASection />

      <div className="space-y-16 max-w-4xl mx-auto w-full">
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <h2 className="text-2xl font-semibold tracking-tight">Writings</h2>
            <Link
              href="/logbook?tab=Thoughts"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
            >
              Browse all writings <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-5">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.type}/${post.slug}`}
                className="block group"
              >
                <article className="space-y-2 rounded-3xl border border-transparent hover:border-border/70 hover:bg-white/45 px-5 py-5 transition-all">
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

        <ListeningsSection data={spotifyData} />
      </div>
    </div>
  );
}
