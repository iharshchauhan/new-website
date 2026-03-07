import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import { BackNavLink } from '@/components/back-nav-link';
import Image from 'next/image';
import { InteractiveExplainerHub } from '@/components/interactive-explainer-hub';
import { getProjectTopicItems } from '@/lib/project-navigation';
import { ProjectTopicMap } from '@/components/project-topic-map';

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

  const topicItems = getProjectTopicItems(project);
  const showInteractiveHub = project === 'interactive-explainers-framework';

  return (
    <article className="max-w-6xl mx-auto space-y-12">
      <div className="space-y-8">
        <BackNavLink href="/logbook" label="Back to Logbook" />
        <div className="space-y-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-primary">
            {post.meta.title}
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl">
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

      <div className="grid lg:grid-cols-[minmax(0,1fr)_350px] gap-10 items-start">
        <div className="space-y-12">
          {showInteractiveHub && <InteractiveExplainerHub />}
          <div className="rounded-2xl border border-white/60 bg-[#f6f4ea]/85 px-5 sm:px-8 py-8">
            <MDXContent content={post.content} />
          </div>
        </div>

        {topicItems.length > 0 && (
          <ProjectTopicMap
            projectSlug={project}
            items={topicItems}
            className="lg:sticky lg:top-24"
          />
        )}
      </div>
    </article>
  );
}
