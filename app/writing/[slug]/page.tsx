import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';

export async function generateStaticParams() {
  const slugs = getPostSlugs('writing');
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'writing');

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-5xl mx-auto rounded-2xl border border-white/70 bg-[#f6f4ea]/92 px-6 sm:px-10 py-6 sm:py-10 relative">
      <Link
        href="/logbook?tab=Notes"
        className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-primary hover:bg-white transition-colors"
        aria-label="Close note"
      >
        <X className="h-5 w-5" />
      </Link>

      <div className="space-y-10 pb-8">
        <div className="space-y-5 text-center">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#055f57] leading-none">
            {post.meta.title}
          </h1>
          <div className="flex items-center justify-center space-x-3 text-sm sm:text-base text-foreground/70">
            <span className="inline-block h-2 w-2 rounded-full bg-primary/65" />
            <time dateTime={post.meta.date}>
              {new Date(post.meta.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </div>

      <MDXContent content={post.content} className="notes-prose max-w-3xl mx-auto" />
    </article>
  );
}
