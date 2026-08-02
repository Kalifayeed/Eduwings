import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** Omitted on the final (current) crumb. */
  href?: string;
}

interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb trail. Renders an ordered list so assistive technology announces
 * position and depth; the current page is marked with `aria-current`.
 */
function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-sm transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-medium text-foreground"
                >
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight aria-hidden className="size-3.5 opacity-60" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
