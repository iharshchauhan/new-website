import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export type PostMeta = {
  title: string;
  date: string;
  description: string;
  coverImage?: string;
  category: string;
  tags: string[];
};

export type Post = {
  slug: string;
  type: "writing" | "projects";
  subpage?: string;
  meta: PostMeta;
  content: string;
};

function normalizeCategory(category: string | undefined, type: "writing" | "projects") {
  const raw = (category || "").trim();
  const fallback = type === "projects" ? "Experiments" : "Thoughts";

  if (!raw) return fallback;

  const categoryMap: Record<string, string> = {
    Logbook: "Thoughts",
    Articles: "Thoughts",
    "Fun Projects": "Experiments",
    "Proof of work": "Systems",
    "Proof of Work": "Systems",
    Frameworks: "Playbooks",
    Reviews: "Notes",
  };

  return categoryMap[raw] || raw;
}

function normalizeTag(tag: string) {
  const normalized = tag.trim();
  const tagMap: Record<string, string> = {
    Logbook: "Thoughts",
    Articles: "Thoughts",
    "Fun Projects": "Experiments",
    "Proof of work": "Systems",
    "Proof of Work": "Systems",
    "Proof Of Work": "Systems",
    Framework: "Playbooks",
    Frameworks: "Playbooks",
    Review: "Notes",
    Reviews: "Notes",
  };

  return tagMap[normalized] || normalized;
}

export function getPostSlugs(type: "writing" | "projects") {
  const dir = path.join(contentDirectory, type);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir, { withFileTypes: true });

  if (type === "projects") {
    // Projects are directories
    return files
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } else {
    // Writing are markdown files
    return files
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".md"))
      .map((dirent) => dirent.name.replace(/\.md$/, ""));
  }
}

export function getPostBySlug(
  slug: string,
  type: "writing" | "projects",
  subpage?: string,
): Post | null {
  let fullPath = "";

  if (type === "projects") {
    if (subpage) {
      fullPath = path.join(contentDirectory, type, slug, `${subpage}.md`);
    } else {
      fullPath = path.join(contentDirectory, type, slug, "index.md");
    }
  } else {
    fullPath = path.join(contentDirectory, type, `${slug}.md`);
  }

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const category = normalizeCategory(data.category, type);
  const normalizedTags = Array.isArray(data.tags)
    ? [...new Set(data.tags.map((tag: unknown) => normalizeTag(String(tag))))]
    : [];

  return {
    slug,
    type,
    subpage,
    meta: {
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      coverImage: data.coverImage || undefined,
      category,
      tags: normalizedTags,
    },
    content,
  };
}

export function getAllPosts(type: "writing" | "projects"): Post[] {
  const slugs = getPostSlugs(type);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, type))
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));
  return posts;
}

export function getProjectSubpages(projectSlug: string) {
  const dir = path.join(contentDirectory, "projects", projectSlug);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir, { withFileTypes: true });
  return files
    .filter(
      (dirent) =>
        dirent.isFile() &&
        dirent.name.endsWith(".md") &&
        dirent.name !== "index.md",
    )
    .map((dirent) => dirent.name.replace(/\.md$/, ""));
}
