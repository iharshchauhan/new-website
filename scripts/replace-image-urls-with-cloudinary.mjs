import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "lib", "cloudinary-manifest.json");
const contentDir = path.join(repoRoot, "content");
const markdownExtensions = new Set([".md", ".mdx"]);

function listFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeImageSrc(rawSrc) {
  if (!rawSrc) return null;

  let normalizedSrc = rawSrc.trim().replace(/\\/g, "/");

  if (
    normalizedSrc.startsWith("http://") ||
    normalizedSrc.startsWith("https://") ||
    normalizedSrc.startsWith("//") ||
    normalizedSrc.startsWith("data:")
  ) {
    return null;
  }

  if (
    normalizedSrc.startsWith("public/") ||
    normalizedSrc.startsWith("./public/") ||
    normalizedSrc.startsWith("../public/") ||
    normalizedSrc.startsWith("../../public/") ||
    normalizedSrc.startsWith("../../../public/")
  ) {
    const publicIndex = normalizedSrc.lastIndexOf("public/");
    normalizedSrc = `/${normalizedSrc.slice(publicIndex + "public".length)}`;
  }

  if (normalizedSrc.startsWith("images/") || normalizedSrc.startsWith("support/images/")) {
    normalizedSrc = `/${normalizedSrc}`;
  }

  if (!normalizedSrc.startsWith("/")) {
    return null;
  }

  return normalizedSrc;
}

function replaceLinks(content, manifest, counters) {
  let updated = content;

  // Markdown image/link syntax: ![alt](url) and [label](url)
  updated = updated.replace(/(!?\[[^\]]*\]\()([^\)\s]+)(\))/g, (match, prefix, src, suffix) => {
    const normalizedSrc = normalizeImageSrc(src);
    if (!normalizedSrc) return match;

    const cloudinaryUrl = manifest[normalizedSrc];
    if (!cloudinaryUrl || cloudinaryUrl === src) return match;

    counters.replacements += 1;
    return `${prefix}${cloudinaryUrl}${suffix}`;
  });

  // HTML image tags: <img src="...">
  updated = updated.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi, (match, prefix, src, suffix) => {
    const normalizedSrc = normalizeImageSrc(src);
    if (!normalizedSrc) return match;

    const cloudinaryUrl = manifest[normalizedSrc];
    if (!cloudinaryUrl || cloudinaryUrl === src) return match;

    counters.replacements += 1;
    return `${prefix}${cloudinaryUrl}${suffix}`;
  });

  return updated;
}

function run() {
  if (!fs.existsSync(manifestPath)) {
    console.error(`Manifest not found: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const markdownFiles = listFilesRecursively(contentDir).filter((filePath) =>
    markdownExtensions.has(path.extname(filePath).toLowerCase()),
  );

  const counters = {
    filesChanged: 0,
    replacements: 0,
  };

  for (const filePath of markdownFiles) {
    const original = fs.readFileSync(filePath, "utf8");
    const updated = replaceLinks(original, manifest, counters);

    if (updated !== original) {
      fs.writeFileSync(filePath, updated, "utf8");
      counters.filesChanged += 1;
      const relativePath = path.relative(repoRoot, filePath).split(path.sep).join("/");
      console.log(`Rewrote Cloudinary URLs in ${relativePath}`);
    }
  }

  console.log(
    `\nDone. Updated ${counters.replacements} references across ${counters.filesChanged} file(s).`,
  );
}

run();
