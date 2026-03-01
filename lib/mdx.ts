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

  let category = data.category;
  if (!category) {
    if (type === "projects") {
      category = "Fun Projects";
    } else {
      category = "Logbook";
    }
  }

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
      tags: data.tags || [],
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
