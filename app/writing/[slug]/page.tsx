import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <article className="max-w-3xl mx-auto space-y-12">
      <div className="space-y-8 border-b border-border pb-8">
        <Link href="/logbook" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Logbook
        </Link>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            {post.meta.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground font-mono">
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
      
      <MDXContent content={post.content} />
    </article>
  );
}
