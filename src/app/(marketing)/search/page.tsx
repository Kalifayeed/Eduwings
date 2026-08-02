import Link from "next/link";
import { ArrowUpRight, SearchIcon } from "lucide-react";

import { routes } from "@/config/routes";
import { search } from "@/lib/search";
import { groupBy } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { SearchInput } from "@/components/search/search-input";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;

  return buildMetadata({
    title: q ? `Search results for “${q}”` : "Search",
    description: "Search careers, articles, events, activities and pages across EduWings.",
    path: routes.search,
    // Search result pages should never be indexed — they create unbounded
    // near-duplicate URLs and dilute the pages that should rank.
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query.length >= 2 ? await search(query, 40) : [];
  const grouped = groupBy(results, (result) => result.group);

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Search EduWings"}
        description={
          query
            ? `${results.length} ${results.length === 1 ? "result" : "results"} across careers, the programme, articles and events.`
            : "Search fourteen career pathways, the full curriculum, every article, and all upcoming events."
        }
        breadcrumbs={[
          { label: "Home", href: routes.home },
          { label: "Search", href: routes.search },
        ]}
      />

      <Section>
        <div className="container-page max-w-3xl">
          <SearchInput initialQuery={query} />

          {query.length >= 2 && results.length === 0 ? (
            <EmptyState
              className="mt-12"
              icon={SearchIcon}
              title={`Nothing matched “${query}”`}
              description="Try a career name, a school subject, a county, or a word from the programme — for example “engineer”, “physics”, or “navigation”."
              action={{ label: "Browse all careers", href: routes.careers }}
            />
          ) : null}

          {results.length > 0 ? (
            <div className="mt-12 grid gap-10">
              {[...grouped.entries()].map(([group, items]) => (
                <Reveal as="section" key={group}>
                  <h2 className="flex items-center gap-3 font-display text-sm font-semibold tracking-wide uppercase">
                    {group}
                    <span className="h-px flex-1 bg-border" aria-hidden />
                    <span className="font-mono text-xs font-normal text-muted-foreground">
                      {items.length}
                    </span>
                  </h2>

                  <ul className="mt-4 grid gap-2">
                    {items.map((result) => (
                      <li key={result.id}>
                        <Link
                          href={result.href}
                          className="group flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-secondary/60"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium transition-colors group-hover:text-primary">
                              {result.title}
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                              {result.description}
                            </span>
                          </span>
                          <ArrowUpRight
                            aria-hidden
                            className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          ) : null}

          {!query ? (
            <Reveal className="mt-12">
              <p className="text-sm text-muted-foreground">Popular searches</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {["pilot", "aircraft engineer", "drone", "physics", "salary", "school visit"].map(
                  (term) => (
                    <li key={term}>
                      <Link
                        href={`${routes.search}?q=${encodeURIComponent(term)}`}
                        className="inline-flex"
                      >
                        <Badge variant="secondary" className="px-3.5 py-1.5 text-sm">
                          {term}
                        </Badge>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </Section>
    </>
  );
}
