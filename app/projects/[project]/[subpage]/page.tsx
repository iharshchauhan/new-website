import { getPostBySlug, getPostSlugs, getProjectSubpages } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const projects = getPostSlugs('projects');
  const params: { project: string; subpage: string }[] = [];

  for (const project of projects) {
    const subpages = getProjectSubpages(project);
    for (const subpage of subpages) {
      params.push({ project, subpage });
    }
  }

  return params;
}

export default async function ProjectSubpage({ params }: { params: Promise<{ project: string; subpage: string }> }) {
  const { project, subpage } = await params;
  const post = getPostBySlug(project, 'projects', subpage);
  const parentProject = getPostBySlug(project, 'projects');

  if (!post || !parentProject) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto space-y-12">
      <div className="space-y-8 border-b border-border pb-8">
        <Link href={`/projects/${project}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {parentProject.meta.title}
        </Link>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            {post.meta.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {post.meta.description}
          </p>
        </div>
      </div>
      
      <MDXContent content={post.content} />
    </article>
  );
}
