import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const projectSlug = "interactive-explainers-framework";
const contentDir = path.join(rootDir, "content", "projects", projectSlug);
const publicDir = path.join(rootDir, "public", "interactive-explainers");
const outDir = path.join(rootDir, "out", "projects", projectSlug);

function walkDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDirectory(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function buildPublicHtmlMap() {
  const fileMap = new Map();
  if (!fs.existsSync(publicDir)) return fileMap;

  for (const filePath of walkDirectory(publicDir)) {
    if (!filePath.endsWith(".html")) continue;

    const relativePath = path.relative(publicDir, filePath).replace(/\\/g, "/");
    const filename = path.basename(filePath);
    if (filename === "index.html") continue;

    const slug = filename.replace(/\.html$/, "");
    fileMap.set(slug, {
      filePath,
      relativePath,
    });
  }

  return fileMap;
}

function rewriteHtml(html) {
  const projectBase = `${basePath}/projects/${projectSlug}`;
  const explainerBase = `${basePath}/interactive-explainers`;

  return html
    .replace(
      /(href|src)=["']\.\.\/styles\/([^"']+)["']/g,
      (_, attr, assetPath) => `${attr}="${explainerBase}/styles/${assetPath}"`,
    )
    .replace(
      /(href|src)=["']\.\.\/index\.html["']/g,
      (_, attr) => `${attr}="${projectBase}/"`,
    )
    .replace(
      /(href)=["']index\.html["']/g,
      (_, attr) => `${attr}="${projectBase}/"`,
    )
    .replace(
      /(href)=["']([a-z0-9-]+)\.html["']/gi,
      (_, attr, slug) => `${attr}="${projectBase}/${slug}/"`,
    );
}

function getFrameworkSlugs() {
  if (!fs.existsSync(contentDir)) return [];

  return fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".html") &&
        entry.name !== "index.html",
    )
    .map((entry) => entry.name.replace(/\.html$/, ""));
}

function syncFrameworkRoutes() {
  const publicHtmlMap = buildPublicHtmlMap();
  const slugs = getFrameworkSlugs();

  for (const slug of slugs) {
    const publicHtml = publicHtmlMap.get(slug);
    if (!publicHtml) {
      console.warn(`No public explainer HTML found for slug: ${slug}`);
      continue;
    }

    const html = fs.readFileSync(publicHtml.filePath, "utf8");
    const rewrittenHtml = rewriteHtml(html);
    const targetDir = path.join(outDir, slug);
    const targetPath = path.join(targetDir, "index.html");

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(targetPath, rewrittenHtml);
  }
}

syncFrameworkRoutes();
