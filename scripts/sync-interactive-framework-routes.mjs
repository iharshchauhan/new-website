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

function buildSiteChrome() {
  const home = `${basePath}/`;
  const logbook = `${basePath}/logbook/`;
  const about = `${basePath}/about/`;
  const framework = `${basePath}/projects/${projectSlug}/`;
  return {
    style: `
  <style>
    body {
      margin: 0;
      background:
        radial-gradient(circle at 50% 8%, rgba(255,255,255,0.32) 0, transparent 44%),
        linear-gradient(180deg, #dccf9f 0%, #e6d8ab 20%, #eee1bb 42%, #f4e9c9 68%, #f8f0db 100%);
      color: #29423d;
      font-family: "Nunito Sans", "Trebuchet MS", sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .site-shell {
      flex: 1;
    }
    .site-nav {
      position: sticky;
      top: 0.75rem;
      z-index: 40;
      display: flex;
      justify-content: center;
      padding: 0.75rem 1rem 0;
    }
    .site-nav__inner {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      border: 1px solid rgba(255,255,255,0.7);
      background: rgba(243,242,234,0.78);
      backdrop-filter: blur(10px);
      border-radius: 999px;
      padding: 0.35rem;
      box-shadow: 0 10px 30px rgba(24,52,47,0.08);
    }
    .site-nav__inner a {
      color: rgba(41,66,61,0.82);
      text-decoration: none;
      font-weight: 700;
      padding: 0.65rem 1rem;
      border-radius: 999px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .site-nav__inner a:hover {
      background: rgba(255,255,255,0.72);
      color: #29423d;
    }
    .framework-back {
      max-width: 72rem;
      margin: 0 auto;
      padding: 1.25rem 1.5rem 0;
    }
    .framework-back a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #5b756f;
      text-decoration: none;
      font-weight: 700;
    }
    .framework-back a:hover {
      color: #29423d;
    }
    .site-footer {
      width: min(64rem, calc(100% - 2rem));
      margin: 0 auto;
      padding: 3rem 1.5rem;
      color: #6b807a;
      text-align: center;
      font-size: 0.95rem;
    }
    .site-footer__dots {
      overflow: hidden;
      color: rgba(58,159,138,0.7);
      font-size: 10px;
      letter-spacing: 0.5em;
      opacity: 0.8;
      white-space: nowrap;
      margin-bottom: 2rem;
    }
    .site-footer__meta {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      align-items: center;
    }
    .site-footer__meta a,
    .site-footer__meta span {
      color: inherit;
      text-decoration: none;
    }
    .site-footer__meta a:hover {
      color: #29423d;
    }
    .site-footer__line {
      opacity: 0.5;
    }
    .site-footer__accent {
      border-bottom: 2px solid rgba(58,159,138,0.7);
      padding-bottom: 0.15rem;
    }
    @media (max-width: 640px) {
      .site-nav {
        justify-content: stretch;
      }
      .site-nav__inner {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }
      .framework-back {
        padding-top: 1rem;
      }
    }
  </style>`,
    nav: `
  <nav class="site-nav" aria-label="Site">
    <div class="site-nav__inner">
      <a href="${home}">Home</a>
      <a href="${logbook}">Logbook</a>
      <a href="${about}">About</a>
    </div>
  </nav>
  <div class="framework-back">
    <a href="${framework}">&larr; Back to Interactive AI Product Framework</a>
  </div>`,
    footer: `
  <footer class="site-footer">
    <div class="site-footer__dots">••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••</div>
    <div class="site-footer__meta">
      <a href="https://github.com/iharshchauhan" target="_blank" rel="noreferrer">GitHub</a>
      <span class="site-footer__line">|</span>
      <a href="https://twitter.com/harshc_/" target="_blank" rel="noreferrer">Twitter</a>
      <span class="site-footer__line">|</span>
      <a href="https://instagram.com/iharshchauhan/" target="_blank" rel="noreferrer">Instagram</a>
      <span class="site-footer__line">|</span>
      <a href="https://open.spotify.com/playlist/6rhg71awO0tB2GIunqOxAg?si=b1cb737056354412" target="_blank" rel="noreferrer">Music</a>
      <span class="site-footer__line">|</span>
      <span>2025 &copy; Harsh Chauhan</span>
      <span class="site-footer__line">|</span>
      <a href="mailto:hey@iharsh.xyz" class="site-footer__accent">Contact</a>
      <span class="site-footer__line">|</span>
      <a href="https://www.websitecarbon.com/website/iharsh-xyz/" target="_blank" rel="noreferrer">This page visit emitted <span class="site-footer__accent">0.04g of CO2</span> :)</a>
    </div>
  </footer>`,
  };
}

function rewriteHtml(html) {
  const projectBase = `${basePath}/projects/${projectSlug}`;
  const explainerBase = `${basePath}/interactive-explainers`;
  const { style, nav, footer } = buildSiteChrome();

  let rewritten = html
    .replace(
      /(href|src)=["']\/interactive-explainers\/([^"']+)["']/g,
      (_, attr, targetPath) => `${attr}="${explainerBase}/${targetPath}"`,
    )
    .replace(
      /(href|src)=["']\/projects\/interactive-explainers-framework\/?([^"']*)["']/g,
      (_, attr, targetPath) => `${attr}="${projectBase}${targetPath ? `/${targetPath}` : "/"}`,
    )
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

  if (!rewritten.includes("site-nav__inner")) {
    rewritten = rewritten.replace("</head>", `${style}\n</head>`);
    rewritten = rewritten.replace(/<body([^>]*)>/i, `<body$1>\n${nav}\n<div class="site-shell">`);
    rewritten = rewritten.replace("</body>", `</div>\n${footer}\n</body>`);
  }

  return rewritten;
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
