import Link from "next/link";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  basePath: string;
  paramName: string;
  options: string[];
  active?: string;
  allLabel?: string;
  className?: string;
}

/**
 * Server-rendered category filter.
 *
 * Rendered as links rather than buttons so filtering works without JavaScript,
 * each filtered view has its own crawlable URL, and the browser handles history
 * for free. `aria-current` communicates the active filter to assistive tech.
 */
function CategoryFilter({
  basePath,
  paramName,
  options,
  active,
  allLabel = "All",
  className,
}: CategoryFilterProps) {
  const chipClasses = (isActive: boolean) =>
    cn(
      "inline-flex rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
      isActive
        ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
        : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
    );

  return (
    <nav aria-label="Filter by category" className={cn("flex flex-wrap gap-2", className)}>
      <Link
        href={basePath}
        aria-current={active ? undefined : "page"}
        className={chipClasses(!active)}
      >
        {allLabel}
      </Link>

      {options.map((option) => {
        const isActive = active === option;
        return (
          <Link
            key={option}
            href={`${basePath}?${paramName}=${encodeURIComponent(option)}`}
            aria-current={isActive ? "page" : undefined}
            className={chipClasses(isActive)}
          >
            {option}
          </Link>
        );
      })}
    </nav>
  );
}

export { CategoryFilter };
