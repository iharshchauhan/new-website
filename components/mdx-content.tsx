import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import cloudinaryManifest from "@/lib/cloudinary-manifest.json";

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

export function MDXContent({ content }: { content: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
        {content}
      </ReactMarkdown>
    </div>
  );
}
