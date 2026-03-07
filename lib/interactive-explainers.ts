import fs from "fs";
import path from "path";

type InteractiveAsset = {
  slug: string;
  publicPath: string;
  section: string;
};

function humanizeSegment(segment: string) {
  return segment
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function walkDirectory(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

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

let cachedAssets: Map<string, InteractiveAsset> | null = null;

function getInteractiveAssetMap() {
  if (cachedAssets) return cachedAssets;

  const interactiveDir = path.join(process.cwd(), "public", "interactive-explainers");
  const assetMap = new Map<string, InteractiveAsset>();

  if (!fs.existsSync(interactiveDir)) {
    cachedAssets = assetMap;
    return assetMap;
  }

  for (const filePath of walkDirectory(interactiveDir)) {
    if (!filePath.endsWith(".html")) continue;

    const relativePath = path.relative(interactiveDir, filePath).replace(/\\/g, "/");
    const pathParts = relativePath.split("/");
    const filename = pathParts[pathParts.length - 1];

    if (filename === "index.html") continue;

    const slug = filename.replace(/\.html$/, "");
    const section = pathParts.length > 1 ? humanizeSegment(pathParts[0]) : "Interactive Explainers";

    assetMap.set(slug, {
      slug,
      publicPath: `/interactive-explainers/${relativePath}`,
      section,
    });
  }

  cachedAssets = assetMap;
  return assetMap;
}

export function getInteractiveExplainerAsset(slug: string) {
  return getInteractiveAssetMap().get(slug) ?? null;
}
