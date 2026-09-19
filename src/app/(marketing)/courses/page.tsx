import { Info } from "lucide-react";

import { routes } from "@/config/routes";
import { INSTITUTION_TYPES, institutions, type InstitutionType } from "@/lib/content/institutions";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { CategoryFilter } from "@/components/content/category-filter";
import { EmptyState } from "@/components/ui/empty-state";
import { InstitutionCard } from "@/components/cards/institution-card";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Where to Train", href: routes.courses },
];

export const metadata = buildMetadata({
  title: "Aviation Courses in Kenya",
  description:
    "KCAA-approved aviation training institutions in Kenya and the courses they actually offer — pilot training, aircraft maintenance engineering and air traffic services.",
  path: routes.courses,
  keywords: [
    "aviation courses in Kenya",
    "aviation colleges in Kenya",
    "pilot training Kenya",
    "aircraft maintenance courses Kenya",
    "KCAA approved training organisation",
  ],
});

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const { type } = await searchParams;
  const selected = INSTITUTION_TYPES.find((item) => item === type) as InstitutionType | undefined;
  const filtered = selected
    ? institutions.filter((institution) => institution.type === selected)
    : institutions;

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Where to train"
        title="Real institutions, checked against KCAA's own approved list."
        description="Every entry here is cross-checked against KCAA's published Approved Training Organizations list and the institution's own official site. EduWings offers school awareness and guidance, not these professional courses. Explore our career catalogues for subjects, requirements and career opportunities."
        breadcrumbs={BREADCRUMBS}
      />

      <Section>
        <div className="container-page">
          <CategoryFilter
            basePath={routes.courses}
            paramName="type"
            options={[...INSTITUTION_TYPES]}
            active={selected}
            allLabel="All institutions"
          />

          {filtered.length === 0 ? (
            <EmptyState
              className="mt-14"
              title="Nothing verified in this category yet"
              description="We only publish an institution once it is cross-checked against KCAA's own list. Try another category."
              action={{ label: "See all institutions", href: routes.courses }}
            />
          ) : (
            <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((institution) => (
                <RevealItem as="li" key={institution.slug}>
                  <InstitutionCard institution={institution} className="h-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          )}

          <Reveal className="mt-16">
            <Alert variant="info" className="mx-auto max-w-3xl">
              <Info aria-hidden />
              <AlertTitle>On fees and durations</AlertTitle>
              <AlertDescription>
                We deliberately do not publish fee figures here — they change often and an
                out-of-date number is worse than none. Course durations are shown only where a
                specific figure is genuinely verified; otherwise we say so and point you to the
                institution directly.
              </AlertDescription>
            </Alert>
          </Reveal>
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          title="Not sure which institution fits your students?"
          description="Request an aviation visit and we will help match your group to the right destination."
          primary={{ label: "Plan an aviation visit", href: routes.visit }}
          secondary={{ label: "Explore aviation careers", href: routes.careers }}
        />
      </Section>
    </>
  );
}
