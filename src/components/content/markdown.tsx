import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/**
 * Long-form content renderer.
 *
 * Markdown rather than raw HTML is a security decision as much as an authoring
 * one: `react-markdown` does not evaluate embedded HTML unless explicitly told
 * to, so CMS-authored content cannot inject script into the page. We therefore
 * never enable `rehype-raw`.
 *
 * Internal links are routed through `next/link` for client-side navigation;
 * external links get `rel="noopener noreferrer"` automatically.
 */
function MarkdownContent({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("prose-eduwings", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const target = href ?? "#";
            const isInternal = target.startsWith("/") || target.startsWith("#");

            if (isInternal) {
              return (
                <Link href={target} {...props}>
                  {children}
                </Link>
              );
            }

            return (
              <a href={target} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export { MarkdownContent };
