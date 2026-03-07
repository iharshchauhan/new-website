import { getPostBySlug, getProjectSubpages } from "@/lib/mdx";

export type ProjectTopicItem = {
  slug: string;
  title: string;
  description: string;
  group: string;
  order: number;
};

export function humanizeSegment(segment: string) {
  return segment
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export function slugToSegments(slug: string): string[] {
  return slug
    .split("--")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function segmentsToSlug(segments: string[]): string {
  return segments.map((segment) => segment.trim()).filter(Boolean).join("--");
}

export function getProjectSubpageHref(projectSlug: string, subpageSlug: string): string {
  const segments = slugToSegments(subpageSlug);
  return `/projects/${projectSlug}/${segments.join("/")}`;
}

function inferGroup(slug: string, title: string) {
  const hierarchy = slugToSegments(slug);
  if (hierarchy.length > 1) {
    return humanizeSegment(hierarchy[0]);
  }

  const layerMatch = title.match(/^Layer\s+(\d+)/i);
  if (layerMatch) return "Layers";

  const slugLayerMatch = slug.match(/layer-(\d+)/i);
  if (slugLayerMatch) return "Layers";

  return "Topics";
}

function inferOrder(slug: string, title: string) {
  const layerMatch = title.match(/^Layer\s+(\d+)/i);
  if (layerMatch) return Number(layerMatch[1]);

  const slugLayerMatch = slug.match(/layer-(\d+)/i);
  if (slugLayerMatch) return Number(slugLayerMatch[1]);

  return Number.POSITIVE_INFINITY;
}

export function getProjectTopicItems(projectSlug: string): ProjectTopicItem[] {
  const subpages = getProjectSubpages(projectSlug);

  return subpages
    .map((subpage) => {
      const subpageData = getPostBySlug(projectSlug, "projects", subpage);
      if (!subpageData) return null;

      return {
        slug: subpage,
        title: subpageData.meta.title,
        description: subpageData.meta.description,
        group: inferGroup(subpage, subpageData.meta.title),
        order: inferOrder(subpage, subpageData.meta.title),
      };
    })
    .filter((item): item is ProjectTopicItem => item !== null)
    .sort((a, b) => {
      if (a.group !== b.group) return a.group.localeCompare(b.group);
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
}

export function groupProjectTopics(items: ProjectTopicItem[]) {
  const grouped = new Map<string, ProjectTopicItem[]>();

  for (const item of items) {
    const list = grouped.get(item.group) ?? [];
    list.push(item);
    grouped.set(item.group, list);
  }

  return Array.from(grouped.entries()).map(([group, topics]) => ({
    group,
    topics,
  }));
}
