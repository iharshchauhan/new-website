import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { ArrowRight, Github, Twitter, Mail } from "lucide-react";

export default function Home() {
  const writingPosts = getAllPosts("writing");
  const projectPosts = getAllPosts("projects");
  
  const recentPosts = [...writingPosts, ...projectPosts]
    .sort((a, b) => (a.meta.date > b.meta.date ? -1 : 1))
    .slice(0, 5);

  return (
    <div className="space-y-24">
      <section className="relative p-8 md:p-12 rounded-[2rem] overflow-hidden border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] bg-white/40 backdrop-blur-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none" />
        <div className="relative space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            Hey, Stranger! <span className="inline-block animate-wave">👋</span>
          </h1>
          <div className="prose prose-neutral sm:prose-lg text-muted-foreground">
            <p>
              Welcome to my little corner of the web! I'm a Product/Growth
              enthusiast and an amateur human figuring out both the world and the
              web.
            </p>
            <p>
              I dream of making a TON of money with computers, and then... maybe
              never touching one again (just kidding... or am I?)
            </p>
            <p>
              Stick around as I document cool stuff and try to create content
              that's as engaging as my playlist.
            </p>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white/50 hover:bg-white/80 border border-white/60 shadow-sm text-muted-foreground hover:text-foreground transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white/50 hover:bg-white/80 border border-white/60 shadow-sm text-muted-foreground hover:text-foreground transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="mailto:hey@iharsh.xyz"
              className="p-3 rounded-full bg-white/50 hover:bg-white/80 border border-white/60 shadow-sm text-muted-foreground hover:text-foreground transition-all"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

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
