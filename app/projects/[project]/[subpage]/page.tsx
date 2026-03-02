import { getPostBySlug, getPostSlugs, getProjectSubpages } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import { BackNavLink } from '@/components/back-nav-link';

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
        <BackNavLink href={`/projects/${project}`} label={`Back to ${parentProject.meta.title}`} />
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
