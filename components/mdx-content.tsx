import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

export function MDXContent({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: (props) => {
            const src = typeof props.src === "string" ? props.src : "";
            return (
              <span className="block relative w-full h-[400px] my-8 rounded-xl overflow-hidden border border-border">
                <Image
                  src={src}
                  alt={props.alt || ""}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
