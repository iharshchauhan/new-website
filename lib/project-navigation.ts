import { getPostBySlug, getProjectSubpages } from "@/lib/mdx";
import { getInteractiveExplainerAsset } from "@/lib/interactive-explainers";

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
  const interactiveAsset = getInteractiveExplainerAsset(slug);
  if (interactiveAsset) {
    return interactiveAsset.section;
  }

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
    .map((subpage, index) => {
      const subpageData = getPostBySlug(projectSlug, "projects", subpage);
      if (!subpageData) return null;

      const manualOrder = subpageData.meta.order;
      const inferredOrder = inferOrder(subpage, subpageData.meta.title);
      const finalOrder =
        typeof manualOrder === "number" ? manualOrder : inferredOrder;

      return {
        slug: subpage,
        title: subpageData.meta.title,
        description: subpageData.meta.description,
        group: inferGroup(subpage, subpageData.meta.title),
        order: finalOrder,
        sourceIndex: index,
      };
    })
    .filter(
      (item): item is ProjectTopicItem & { sourceIndex: number } => item !== null,
    )
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.sourceIndex - b.sourceIndex;
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
