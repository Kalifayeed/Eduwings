import { ARTICLE_CATEGORIES } from "@/lib/content/types";
import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { ArticleCard } from "@/components/cards/article-card";
import { EmptyState } from "@/components/ui/empty-state";
import { CategoryFilter } from "@/components/content/category-filter";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "News & Articles", href: routes.news },
];

export const metadata = buildMetadata({
  title: "News & Articles",
  description:
    "Field notes from Kenyan classrooms, honest aviation career guidance, student stories, and explainers on how flight actually works.",
  path: routes.news,
});

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NewsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;

  const selected = ARTICLE_CATEGORIES.find((item) => item === category);
  const { items: articles, total } = await getContentSource().articles.list({
    category: selected,
  });

  const [lead, ...rest] = articles;

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Field notes"
        title="What we are learning, written down."
        description="Research from eighty-six classrooms, career guidance that names actual figures, and the student stories that explain why any of this is worth doing."
        breadcrumbs={BREADCRUMBS}
      />

      <Section>
        <div className="container-page">
          <CategoryFilter
            basePath={routes.news}
            paramName="category"
            options={[...ARTICLE_CATEGORIES]}
            active={selected}
            allLabel="Everything"
          />

          {articles.length === 0 ? (
            <EmptyState
              className="mt-14"
              title="Nothing published here yet"
              description={
                selected
                  ? `We have not written anything in ${selected} yet. Try another category.`
                  : "New writing appears here as it is published. Subscribe below and it will reach you first."
              }
              action={{ label: "See all articles", href: routes.news }}
            />
          ) : (
            <>
              <p aria-live="polite" className="sr-only">
                Showing {articles.length} of {total} articles.
              </p>

              {lead ? (
                <div className="mt-12">
                  <ArticleCard article={lead} variant="feature" />
                </div>
              ) : null}

              {rest.length > 0 ? (
                <RevealGroup as="ul" className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <RevealItem as="li" key={article.id}>
                      <ArticleCard article={article} className="h-full" />
                    </RevealItem>
                  ))}
                </RevealGroup>
              ) : null}
            </>
          )}
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          title="We write when we have learned something."
          description="One email a term, with what actually happened in the classrooms we visited."
          primary={{ label: "Request a school visit", href: routes.schools }}
          secondary={{ label: "See our events", href: routes.events }}
        />
      </Section>
    </>
  );
}
