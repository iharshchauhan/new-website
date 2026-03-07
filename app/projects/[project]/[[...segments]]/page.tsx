import { getPostBySlug, getPostSlugs, getProjectSubpages } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import { BackNavLink } from '@/components/back-nav-link';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import {
  getProjectSubpageHref,
  getProjectTopicItems,
  humanizeSegment,
  segmentsToSlug,
  slugToSegments,
} from '@/lib/project-navigation';
import { ProjectTopicMap } from '@/components/project-topic-map';

export async function generateStaticParams() {
  const projects = getPostSlugs('projects');
  const params: { project: string; segments: string[] }[] = [];

  for (const project of projects) {
    const subpages = getProjectSubpages(project);
    for (const subpage of subpages) {
      params.push({ project, segments: slugToSegments(subpage) });
    }
  }

  return params;
}

export default async function ProjectSubpage({
  params,
}: {
  params: Promise<{ project: string; segments?: string[] }>;
}) {
  const { project, segments } = await params;
  const nestedSegments = segments ?? [];

  if (nestedSegments.length === 0) {
    notFound();
  }

  const subpage = segmentsToSlug(nestedSegments);
  const post = getPostBySlug(project, 'projects', subpage);
  const parentProject = getPostBySlug(project, 'projects');
  const topicItems = getProjectTopicItems(project);

  if (!post || !parentProject) {
    notFound();
  }

  const currentIndex = topicItems.findIndex((item) => item.slug === subpage);
  const previousTopic = currentIndex > 0 ? topicItems[currentIndex - 1] : null;
  const nextTopic =
    currentIndex >= 0 && currentIndex < topicItems.length - 1
      ? topicItems[currentIndex + 1]
      : null;

  return (
    <article className="max-w-6xl mx-auto space-y-10">
      <div className="space-y-6">
        <BackNavLink href={`/projects/${project}`} label={`Back to ${parentProject.meta.title}`} />

        <div className="flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-muted-foreground flex-wrap">
          <Link href={`/projects/${project}`} className="hover:text-foreground transition-colors">
            Overview
          </Link>
          {nestedSegments.map((segment, index) => {
            const href = getProjectSubpageHref(
              project,
              segmentsToSlug(nestedSegments.slice(0, index + 1)),
            );
            return (
              <span key={href} className="inline-flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                <Link href={href} className="hover:text-foreground transition-colors">
                  {humanizeSegment(segment)}
                </Link>
              </span>
            );
          })}
        </div>

        <div className="space-y-4 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary">
            {post.meta.title}
          </h1>
          <p className="text-xl text-foreground/80">{post.meta.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_350px] gap-10 items-start">
        <div className="space-y-7">
          <div className="rounded-2xl border border-white/60 bg-[#f6f4ea]/85 px-5 sm:px-8 py-8">
            <MDXContent content={post.content} />
          </div>

          {(previousTopic || nextTopic) && (
            <div className="grid sm:grid-cols-2 gap-3">
              {previousTopic ? (
                <Link
                  href={getProjectSubpageHref(project, previousTopic.slug)}
                  className="rounded-xl border border-border/60 bg-white/55 hover:bg-white/85 transition-colors p-4 space-y-1"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground inline-flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    Previous
                  </p>
                  <p className="font-semibold text-foreground leading-snug">{previousTopic.title}</p>
                </Link>
              ) : (
                <div />
              )}

              {nextTopic ? (
                <Link
                  href={getProjectSubpageHref(project, nextTopic.slug)}
                  className="rounded-xl border border-border/60 bg-white/55 hover:bg-white/85 transition-colors p-4 space-y-1 sm:text-right"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground inline-flex items-center gap-1 sm:justify-end">
                    Next
                    <ArrowRight className="h-3 w-3" />
                  </p>
                  <p className="font-semibold text-foreground leading-snug">{nextTopic.title}</p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>

        {topicItems.length > 0 && (
          <ProjectTopicMap
            projectSlug={project}
            items={topicItems}
            currentSubpage={subpage}
            className="lg:sticky lg:top-24"
          />
        )}
      </div>
    </article>
  );
}
