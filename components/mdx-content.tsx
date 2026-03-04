import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MDXContent({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: (props) => {
            const src = typeof props.src === "string" ? props.src : "";
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
