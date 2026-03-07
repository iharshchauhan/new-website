import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import cloudinaryManifest from "@/lib/cloudinary-manifest.json";
import Mermaid from "@/components/Mermaid";

function normalizeImageSrc(rawSrc: string): string {
  let normalizedSrc = rawSrc.trim();

  // Support GitHub-friendly markdown paths like ../../public/images/x.png
  if (
    normalizedSrc.startsWith("public/") ||
    normalizedSrc.startsWith("./public/") ||
    normalizedSrc.startsWith("../public/") ||
    normalizedSrc.startsWith("../../public/")
  ) {
    const publicIndex = normalizedSrc.lastIndexOf("public/");
    normalizedSrc = `/${normalizedSrc.slice(publicIndex + "public".length)}`;
  }

  return normalizedSrc;
}

function normalizeMermaidBlocks(rawContent: string): string {
  return rawContent.replace(/<Mermaid\s+chart=\{`([\s\S]*?)`\}\s*\/>/g, (_match, chart) => {
    const trimmedChart = String(chart ?? "").trim();
    return `\n\`\`\`mermaid\n${trimmedChart}\n\`\`\`\n`;
  });
}

export function MDXContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalizedContent = normalizeMermaidBlocks(content);

  return (
    <div className={`markdown-body ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const rawHref = typeof href === "string" ? href.trim() : "";
            const isInternalAbsolute =
              rawHref.startsWith("/") &&
              !rawHref.startsWith("//") &&
              !rawHref.startsWith("/#");

            const resolvedHref = isInternalAbsolute ? `${basePath}${rawHref}` : rawHref;

            return (
              <a href={resolvedHref} {...props}>
                {children}
              </a>
            );
          },
          pre: ({ children, ...props }) => {
            const codeChild = React.Children.toArray(children).find((child) => {
              if (
                !React.isValidElement<{
                  className?: string;
                }>(child)
              ) {
                return false;
              }

              const className = typeof child.props.className === "string" ? child.props.className : "";
              return className.includes("language-mermaid");
            });

            if (
              React.isValidElement<{
                children?: React.ReactNode;
              }>(codeChild)
            ) {
              const rawChart = codeChild.props.children;
              const chart = Array.isArray(rawChart)
                ? rawChart.join("")
                : String(rawChart ?? "");
              return <Mermaid chart={chart} />;
            }

            return <pre {...props}>{children}</pre>;
          },
          img: (props) => {
            const rawSrc = typeof props.src === "string" ? props.src : "";
            const normalizedSrc = normalizeImageSrc(rawSrc);
            const cloudinarySrc = cloudinaryManifest[normalizedSrc as keyof typeof cloudinaryManifest];

            const src = cloudinarySrc
              ? cloudinarySrc
              : normalizedSrc.startsWith("/") && !normalizedSrc.startsWith("//")
                ? `${basePath}${normalizedSrc}`
                : normalizedSrc;
            return (
              // Use native img for markdown content so local/static images and gifs render reliably.
              <img
                src={src}
                alt={props.alt || ""}
                className="block w-full h-auto my-8 rounded-xl border border-border"
                loading="lazy"
              />
            );
          },
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
