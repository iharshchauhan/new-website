import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import { ReadingControls } from '@/components/reading-controls';

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
    <>
      <ReadingControls fallbackHref="/logbook?tab=Notes" />
      <article className="max-w-6xl mx-auto rounded-2xl border border-white/70 bg-[#f6f4ea]/93 px-6 sm:px-10 md:px-14 py-6 sm:py-10 relative shadow-[0_12px_36px_rgba(31,68,61,0.08)]">

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

        <MDXContent content={post.content} className="notes-prose max-w-4xl mx-auto" />
      </article>
    </>
  );
}
