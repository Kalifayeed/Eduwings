"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { CAREER_DISCIPLINES, type Career, type CareerDisciplineId } from "@/lib/content/careers";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CareerCard } from "@/components/cards/career-card";

const ALL = "all" as const;

/**
 * Discipline filter for the career catalogue.
 *
 * The active filter lives in the URL rather than component state, so a filtered
 * view is shareable, survives a refresh, and works with the browser's back
 * button. The header's mega menu links straight into a filtered view using the
 * same parameter.
 *
 * `router.replace` with `scroll: false` keeps the reading position steady while
 * still updating history-visible state.
 */
function CareerFilter({ careers }: { careers: Career[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = searchParams.get("discipline");
  const active: CareerDisciplineId | typeof ALL = CAREER_DISCIPLINES.some(
    (discipline) => discipline.id === raw,
  )
    ? (raw as CareerDisciplineId)
    : ALL;

  const setFilter = (value: CareerDisciplineId | typeof ALL) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL) params.delete("discipline");
    else params.set("discipline", value);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const visible = React.useMemo(
    () => (active === ALL ? careers : careers.filter((career) => career.discipline === active)),
    [careers, active],
  );

  const activeDescription =
    active === ALL
      ? null
      : (CAREER_DISCIPLINES.find((discipline) => discipline.id === active)?.blurb ?? null);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter careers by discipline"
        className="flex flex-wrap items-center gap-2"
      >
        <FilterChip active={active === ALL} onClick={() => setFilter(ALL)}>
          All careers
          <span className="ml-1.5 opacity-60">{careers.length}</span>
        </FilterChip>

        {CAREER_DISCIPLINES.map((discipline) => {
          const count = careers.filter((career) => career.discipline === discipline.id).length;
          return (
            <FilterChip
              key={discipline.id}
              active={active === discipline.id}
              onClick={() => setFilter(discipline.id)}
            >
              {discipline.label}
              <span className="ml-1.5 opacity-60">{count}</span>
            </FilterChip>
          );
        })}
      </div>

      {activeDescription ? (
        <p className="mt-5 text-sm text-muted-foreground">{activeDescription}</p>
      ) : null}

      {/* Announce result count changes to screen reader users. */}
      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {careers.length} careers.
      </p>

      <RevealGroup as="ul" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((career) => (
          <RevealItem as="li" key={career.slug}>
            <CareerCard career={career} className="h-full" />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
          : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export { CareerFilter };
