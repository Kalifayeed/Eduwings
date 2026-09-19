import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

import { routes } from "@/config/routes";
import { CAREER_DISCIPLINES, careers } from "@/lib/content/careers";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { CareerFilter } from "@/app/(marketing)/careers/career-filter";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Aviation Courses & Careers", href: routes.careers },
];

export const metadata = buildMetadata({
  title: "Aviation Courses & Careers",
  description:
    "Explore aviation courses and careers in Kenya: what you study, entry requirements, qualifications and opportunities. EduWings provides school awareness and guidance.",
  path: routes.careers,
  keywords: [
    "aviation careers Kenya",
    "how to become a pilot in Kenya",
    "aircraft engineer requirements",
    "air traffic controller training",
    "KCAA licence",
  ],
});

export default function CareersPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Fourteen pathways"
        title="Explore aviation courses and careers in Kenya."
        description="Discover fourteen career paths and the courses that can lead to them. EduWings offers aviation awareness training and guidance for school learners; professional aviation courses are delivered by independent training institutions."
        breadcrumbs={BREADCRUMBS}
        aside={
          <ul className="grid gap-3">
            {CAREER_DISCIPLINES.map((discipline) => (
              <li key={discipline.id} className="rounded-xl border bg-card p-4">
                <p className="text-sm font-semibold">{discipline.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {discipline.blurb}
                </p>
              </li>
            ))}
          </ul>
        }
      />

      <Section>
        <div className="container-page">
          {/* `useSearchParams` requires a Suspense boundary during prerendering. */}
          <Suspense fallback={<CareerGridSkeleton />}>
            <CareerFilter careers={careers} />
          </Suspense>

          <Reveal className="mt-16">
            <Alert variant="info" className="mx-auto max-w-3xl">
              <Info aria-hidden />
              <AlertTitle>Awareness now. Informed choices for the future.</AlertTitle>
              <AlertDescription>
                Explore each catalogue for course content, institution-specific entry requirements,
                qualifications and career opportunities. EduWings does not enrol learners in, teach
                or award the professional aviation qualifications described here.
                <Link href={routes.photoCredits} className="mt-3 block text-primary underline">
                  Stock photography credits
                </Link>
              </AlertDescription>
            </Alert>
          </Reveal>
        </div>
      </Section>

      <Section tone="surface" size="sm">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
              Not sure which of these fits you?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our Career Map session does this properly: students bring their current subject grades
              and leave with a written pathway and a first step for the current term.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href={`${routes.activities}#career-map`}>
                See the Career Map session
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          title="Bring these fourteen careers into your classroom."
          description="Our school awareness modules and career guidance help learners understand these pathways and plan their next steps."
          primary={{ label: "Get Quotation", href: routes.quotation }}
          secondary={{ label: "See the programme", href: routes.program }}
        />
      </Section>
    </>
  );
}

function CareerGridSkeleton() {
  return (
    <div>
      <span className="sr-only" role="status">
        Loading careers
      </span>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-36 rounded-full" />
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-96 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
