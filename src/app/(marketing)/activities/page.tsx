import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Users } from "lucide-react";

import { routes } from "@/config/routes";
import { activities } from "@/lib/content/editorial";
import { Icon } from "@/components/icon";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { AppImage } from "@/components/media/app-image";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Activities", href: routes.activities },
];

export const metadata = buildMetadata({
  title: "Activities",
  description:
    "Eight hands-on aviation activities for schools: build and test wings, fly a simulator approach, run an aircraft turnaround, plot a route without GPS, and map your own career pathway.",
  path: routes.activities,
});

export default function ActivitiesPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="What students actually do"
        title="Nobody remembers a slide."
        description="Every EduWings session is hands-on. Students build things, break things, fly approaches, argue about weather, and fail an aircraft turnaround before getting it right. These are the eight activities we bring."
        breadcrumbs={BREADCRUMBS}
        actions={
          <Button asChild size="lg">
            <Link href={routes.schools}>
              Request these for your school
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <Section>
        <div className="container-page grid gap-20">
          {activities.map((activity, index) => {
            const reversed = index % 2 === 1;

            return (
              <Reveal
                as="article"
                key={activity.slug}
                id={activity.slug}
                className="grid scroll-mt-32 items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={reversed ? "lg:order-2" : undefined}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[var(--shadow-float)]">
                    <AppImage
                      src={null}
                      alt={`Students taking part in ${activity.title}`}
                      seed={activity.slug}
                      motif={activity.motif}
                      label={`${activity.durationMinutes} min`}
                      sizes="(min-width: 1024px) 34rem, 100vw"
                      className="size-full"
                    />
                  </div>
                </div>

                <div className={reversed ? "lg:order-1" : undefined}>
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon name={activity.icon} className="size-6" aria-hidden />
                  </span>

                  <h2 className="mt-6 font-display text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                    {activity.title}
                  </h2>
                  <p className="mt-3 text-base font-medium text-balance text-primary">
                    {activity.tagline}
                  </p>
                  <p className="mt-5 leading-relaxed text-muted-foreground">{activity.body}</p>

                  <ul className="mt-7 grid gap-2.5">
                    {activity.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-sm leading-relaxed">
                        <Sparkles aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <Clock className="size-3.5" aria-hidden />
                      {activity.durationMinutes} minutes
                    </Badge>
                    <Badge variant="secondary">
                      <Users className="size-3.5" aria-hidden />
                      {activity.groupSize}
                    </Badge>
                    <Badge variant="outline">{activity.suitableFor}</Badge>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          eyebrow="Pick any, or take the lot"
          title="Which of these would your students remember in a year?"
          description="Tell us your year groups and how long you can give us. We will build the day around your timetable."
          primary={{ label: "Request a school visit", href: routes.schools }}
          secondary={{ label: "See the full curriculum", href: routes.program }}
        />
      </Section>
    </>
  );
}
