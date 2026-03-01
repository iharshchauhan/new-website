import { getPostBySlug, getPostSlugs, getProjectSubpages } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import Image from 'next/image';

export async function generateStaticParams() {
  const slugs = getPostSlugs('projects');
  return slugs.map((project) => ({ project }));
}

export default async function ProjectPage({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const post = getPostBySlug(project, 'projects');

  if (!post) {
    notFound();
  }

  const subpages = getProjectSubpages(project);

  return (
    <article className="max-w-4xl mx-auto space-y-16">
      <div className="space-y-8">
        <Link href="/logbook" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Logbook
        </Link>
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            {post.meta.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {post.meta.description}
          </p>
        </div>
      </div>

      {post.meta.coverImage && (
        <div className="aspect-[21/9] rounded-3xl overflow-hidden relative border border-border">
          <Image
            src={post.meta.coverImage}
            alt={post.meta.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_300px] gap-12">
        <div className="space-y-12">
          <MDXContent content={post.content} />
        </div>

        {subpages.length > 0 && (
          <aside className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Deep Dives
            </h3>
            <div className="flex flex-col space-y-2">
              {subpages.map((subpage) => {
                const subpageData = getPostBySlug(project, 'projects', subpage);
                if (!subpageData) return null;
                return (
                  <Link
                    key={subpage}
                    href={`/projects/${project}/${subpage}`}
                    className="group bg-muted/50 p-4 rounded-xl hover:bg-muted transition-colors flex items-center justify-between border border-transparent hover:border-border"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-medium">{subpageData.meta.title}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
