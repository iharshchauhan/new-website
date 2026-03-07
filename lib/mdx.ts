import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export type PostMeta = {
  title: string;
  date: string;
  description: string;
  order?: number;
  coverImage?: string;
  category: string;
  tags: string[];
};

export type Post = {
  slug: string;
  type: "writing" | "projects";
  subpage?: string;
  format: "md" | "html";
  meta: PostMeta;
  content: string;
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&amp;/gi, "&")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

function extractHtmlPostMeta(fileContents: string, fallbackDate = "") {
  const titleMatch = fileContents.match(/<title>([\s\S]*?)<\/title>/i);
  const descriptionMatch = fileContents.match(
    /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["'][^>]*>/i,
  );
  const leadMatch = fileContents.match(
    /<p[^>]*class=["'][^"']*lead[^"']*["'][^>]*>([\s\S]*?)<\/p>/i,
  );
  const headingMatch = fileContents.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

  const title = decodeHtmlEntities(
    stripHtml(titleMatch?.[1] || headingMatch?.[1] || ""),
  );
  const description = decodeHtmlEntities(
    stripHtml(descriptionMatch?.[1] || leadMatch?.[1] || ""),
  );

  return {
    title,
    description,
    date: fallbackDate,
  };
}

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
  let format: "md" | "html" = "md";

  if (type === "projects") {
    if (subpage) {
      const mdPath = path.join(contentDirectory, type, slug, `${subpage}.md`);
      const htmlPath = path.join(contentDirectory, type, slug, `${subpage}.html`);

      if (fs.existsSync(mdPath)) {
        fullPath = mdPath;
      } else if (fs.existsSync(htmlPath)) {
        fullPath = htmlPath;
        format = "html";
      } else {
        return null;
      }
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

  if (format === "html") {
    const parentPost = getPostBySlug(slug, type);
    const htmlMeta = extractHtmlPostMeta(fileContents, parentPost?.meta.date || "");

    return {
      slug,
      type,
      subpage,
      format,
      meta: {
        title: htmlMeta.title,
        date: htmlMeta.date,
        description: htmlMeta.description,
        category: parentPost?.meta.category || normalizeCategory(undefined, type),
        tags: parentPost?.meta.tags || [],
      },
      content: fileContents,
    };
  }

  const { data, content } = matter(fileContents);

  const category = normalizeCategory(data.category, type);
  const normalizedTags = Array.isArray(data.tags)
    ? [...new Set(data.tags.map((tag: unknown) => normalizeTag(String(tag))))]
    : [];

  return {
    slug,
    type,
    subpage,
    format,
    meta: {
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      order: typeof data.order === "number" ? data.order : undefined,
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
        (dirent.name.endsWith(".md") || dirent.name.endsWith(".html")) &&
        dirent.name !== "index.md" &&
        dirent.name !== "index.html",
    )
    .map((dirent) => dirent.name.replace(/\.(md|html)$/, ""));
}
