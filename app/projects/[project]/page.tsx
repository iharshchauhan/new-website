import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import { BackNavLink } from '@/components/back-nav-link';
import Image from 'next/image';
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

  return (
    <article className="max-w-[96rem] mx-auto space-y-10">
      <div className="space-y-8">
        <BackNavLink href="/logbook" label="Back to Logbook" />
        <div className="space-y-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-primary">
            {post.meta.title}
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl">
            {post.meta.description}
          </p>
          <time dateTime={post.meta.date} className="block text-sm font-medium text-muted-foreground">
            {new Date(post.meta.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
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

      <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-10 items-start">
        <div className="space-y-12 lg:order-2">
          <div className="rounded-2xl border border-white/60 bg-[#f6f4ea]/85 px-6 sm:px-12 py-8">
            <MDXContent content={post.content} />
          </div>
        </div>

        {topicItems.length > 0 && (
          <ProjectTopicMap
            projectSlug={project}
            items={topicItems}
            className="lg:sticky lg:top-16 lg:self-start lg:order-1"
          />
        )}
      </div>
    </article>
  );
}
