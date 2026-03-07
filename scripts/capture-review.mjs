import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });
dotenv.config({ path: path.join(process.cwd(), ".env.local"), override: true });

const CONTENT_DIR = path.join(process.cwd(), "content", "writing");

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getEnv(name, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function escapeYaml(value) {
  return String(value).replace(/"/g, '\\"');
}

function uniqueFilePath(baseSlug, dateStr) {
  let candidate = `${dateStr}-${baseSlug || "review"}.md`;
  let fullPath = path.join(CONTENT_DIR, candidate);
  let idx = 2;
  while (fs.existsSync(fullPath)) {
    candidate = `${dateStr}-${baseSlug || "review"}-${idx}.md`;
    fullPath = path.join(CONTENT_DIR, candidate);
    idx += 1;
  }
  return { fullPath };
}

function truncate(text, maxLen) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return `${text.slice(0, Math.max(0, maxLen - 3))}...`;
}

async function fetchReadableArticle(url) {
  const cleaned = url.trim();
  const noProtocol = cleaned.replace(/^https?:\/\//i, "");
  const mirrorUrl = `https://r.jina.ai/http://${noProtocol}`;
  const res = await fetch(mirrorUrl, {
    headers: {
      "User-Agent": "capture-review-bot/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch readable article (${res.status})`);
  }

  const text = await res.text();
  return text.replace(/\0/g, "").trim();
}

function guessTitleFromReadableText(readable) {
  const lines = readable.split("\n").map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.toLowerCase().startsWith("title:")) {
      return line.replace(/^title:\s*/i, "").trim();
    }
  }
  return lines[0] || "";
}

function buildPrompt({ url, inferredTitle, articleText }) {
  const clippedArticle = truncate(articleText, 16000);
  return [
    "You are preparing a concise review note for a personal website.",
    "Return valid Markdown only, without YAML frontmatter.",
    "Use these sections exactly:",
    "## TL;DR",
    "## Key Ideas",
    "## What I Agree With",
    "## What I Challenge",
    "## Actionable Takeaways",
    "",
    "Constraints:",
    "- Keep total output under 350 words.",
    "- Use neutral, specific language.",
    "- If any information is unclear, state assumptions explicitly.",
    "",
    `Article URL: ${url}`,
    `Detected title: ${inferredTitle || "Unknown"}`,
    "",
    "Article text:",
    clippedArticle,
  ].join("\n");
}

async function summarizeWithGemini({ apiKey, model, prompt }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini request failed (${res.status}): ${truncate(errBody, 300)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini returned empty content");
  }

  return text;
}

async function summarizeWithGrok({ apiKey, model, prompt }) {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "You create clear, structured markdown summaries for technical reviews.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Grok request failed (${res.status}): ${truncate(errBody, 300)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("Grok returned empty content");
  }
  return text;
}

async function summarizeWithGroq({ apiKey, model, prompt }) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_completion_tokens: 800,
      messages: [
        {
          role: "system",
          content: "You create clear, structured markdown summaries for technical reviews.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq request failed (${res.status}): ${truncate(errBody, 300)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("Groq returned empty content");
  }
  return text;
}

function fallbackSummary(url) {
  return [
    "## TL;DR",
    "- Added from mobile capture.",
    "- AI summary is currently unavailable in this run.",
    "- Review manually before publishing.",
    "",
    "## Key Ideas",
    `- Source: ${url}`,
    "",
    "## What I Agree With",
    "- Pending manual review.",
    "",
    "## What I Challenge",
    "- Pending manual review.",
    "",
    "## Actionable Takeaways",
    "- Re-run with `summary_text` or configured AI key.",
  ].join("\n");
}

function cleanSummary(summary) {
  return summary
    .replace(/\r\n/g, "\n")
    .replace(/^\s*```(?:markdown|md)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function safeOutput(name, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!outputFile) return;
  const cleaned = String(value).replace(/\r?\n/g, " ").trim();
  fs.appendFileSync(outputFile, `${name}=${cleaned}\n`, "utf8");
}

async function main() {
  const articleUrl = getRequiredEnv("ARTICLE_URL");
  const manualTitle = getEnv("ARTICLE_TITLE");
  const manualSummary = getEnv("SUMMARY_TEXT");
  const provider = getEnv("AI_PROVIDER", "gemini").toLowerCase();
  const requestedModel = getEnv("AI_MODEL");
  const sourceLabel = getEnv("CAPTURE_SOURCE", "phone-capture");
  const extraTagsRaw = getEnv("ARTICLE_TAGS", "Review,Notes");

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const host = (() => {
    try {
      return new URL(articleUrl).hostname.replace(/^www\./, "");
    } catch {
      return "source";
    }
  })();

  const readable = await fetchReadableArticle(articleUrl);
  const inferredTitle = manualTitle || guessTitleFromReadableText(readable) || `Review of ${host}`;
  const prompt = buildPrompt({ url: articleUrl, inferredTitle, articleText: readable });

  let finalSummary = "";
  let modelUsed = "manual";

  if (manualSummary) {
    finalSummary = cleanSummary(manualSummary);
    modelUsed = "manual-summary";
  } else if (provider === "none") {
    finalSummary = fallbackSummary(articleUrl);
    modelUsed = "none";
  } else if (provider === "gemini") {
    const apiKey = getEnv("GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY is required when provider=gemini");
    const model = requestedModel || "gemini-2.0-flash";
    finalSummary = cleanSummary(await summarizeWithGemini({ apiKey, model, prompt }));
    modelUsed = `gemini:${model}`;
  } else if (provider === "grok") {
    const apiKey = getEnv("GROK_API_KEY");
    if (!apiKey) throw new Error("GROK_API_KEY is required when provider=grok");
    const model = requestedModel || "grok-2-latest";
    finalSummary = cleanSummary(await summarizeWithGrok({ apiKey, model, prompt }));
    modelUsed = `grok:${model}`;
  } else if (provider === "groq") {
    const apiKey = getEnv("GROQ_API_KEY");
    if (!apiKey) throw new Error("GROQ_API_KEY is required when provider=groq");
    const model = requestedModel || "llama-3.3-70b-versatile";
    finalSummary = cleanSummary(await summarizeWithGroq({ apiKey, model, prompt }));
    modelUsed = `groq:${model}`;
  } else {
    throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
  }

  const description = truncate(
    finalSummary
      .replace(/^#+\s.*$/gm, "")
      .replace(/[*_`>-]/g, "")
      .replace(/\s+/g, " ")
      .trim(),
    170,
  );

  const tags = Array.from(
    new Set(
      ["Review", "Notes"]
        .concat(
          extraTagsRaw
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        )
        .slice(0, 8),
    ),
  );

  const slugBase = slugify(inferredTitle || host || crypto.randomUUID());
  const { fullPath } = uniqueFilePath(slugBase, dateStr);
  const reviewTitle = truncate(inferredTitle, 120);

  const md = [
    "---",
    `title: "${escapeYaml(reviewTitle)}"`,
    `date: "${dateStr}"`,
    `description: "${escapeYaml(description || `Review note for ${host}`)}"`,
    'category: "Notes"',
    `tags: [${tags.map((tag) => `"${escapeYaml(tag)}"`).join(", ")}]`,
    `sourceUrl: "${escapeYaml(articleUrl)}"`,
    `source: "${escapeYaml(sourceLabel)}"`,
    `aiModel: "${escapeYaml(modelUsed)}"`,
    "---",
    "",
    `# ${reviewTitle}`,
    "",
    `Source: [${host}](${articleUrl})`,
    "",
    finalSummary,
    "",
    "## Original Link",
    `- ${articleUrl}`,
    "",
  ].join("\n");

  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(fullPath, md, "utf8");

  const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, "/");
  console.log(`Created ${relativePath}`);
  safeOutput("review_file", relativePath);
  safeOutput("review_title", reviewTitle);
  safeOutput("review_model", modelUsed);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
