import * as React from "react";

import { cn } from "@/lib/utils";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Reveal } from "@/components/motion/reveal";

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  /** Call-to-action row rendered beneath the description. */
  actions?: React.ReactNode;
  /** Statistic strip or supporting panel rendered alongside on wide screens. */
  aside?: React.ReactNode;
  className?: string;
}

/**
 * The standard hero for every page except the home page.
 *
 * Consistency here does real work: visitors learn the page shape once, and the
 * breadcrumb sits in the same place on all fifteen routes.
 */
function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  aside,
  className,
}: PageHeroProps) {
  return (
    <div className={cn("relative overflow-hidden border-b bg-aurora", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="relative container-page pt-10 pb-16 sm:pt-12 sm:pb-20">
        {breadcrumbs?.length ? <Breadcrumb items={breadcrumbs} className="mb-8" /> : null}

        <div className={cn("grid gap-12", aside && "lg:grid-cols-[1.4fr_1fr] lg:items-end")}>
          <Reveal className="max-w-3xl">
            {eyebrow ? (
              <p className="mb-4 font-mono text-xs font-medium tracking-[0.18em] text-primary uppercase">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            {description ? (
              <div className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </div>
            ) : null}

            {actions ? <div className="mt-9 flex flex-wrap gap-3">{actions}</div> : null}
          </Reveal>

          {aside ? <Reveal delay={0.12}>{aside}</Reveal> : null}
        </div>
      </div>
    </div>
  );
}

export { PageHero };
