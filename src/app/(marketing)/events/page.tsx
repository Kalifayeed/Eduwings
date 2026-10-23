import { CalendarDays } from "lucide-react";

import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { aviationTourSlug, withAviationTour } from "@/lib/content/aviation-tour";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { EventCard } from "@/components/cards/event-card";
import { AviationTourPromo } from "@/components/events/aviation-tour-promo";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCountdown } from "@/components/events/event-countdown";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Events", href: routes.events },
];

export const metadata = buildMetadata({
  title: "Events",
  description:
    "Open days, airport tours, career fairs and webinars. Explore dates, prices and inquiry details for upcoming events.",
  path: routes.events,
});

/** Seat counts change as registrations arrive, so this list is never cached. */
export const revalidate = 0;

export default async function EventsPage() {
  const source = getContentSource();

  const [upcoming, past] = await Promise.all([
    source.events.list({ when: "upcoming" }),
    source.events.list({ when: "past", limit: 6 }),
  ]);
  const upcomingItems = withAviationTour(upcoming.items, "upcoming");
  const pastItems = withAviationTour(past.items, "past");
  const next = upcomingItems[0];

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Events"
        title="Come and stand next to an aircraft."
        description="Open days, airport tours, career fairs and briefings for parents. Check each event for its location, price and how to inquire or register."
        breadcrumbs={BREADCRUMBS}
        aside={next ? <EventCountdown event={next} /> : undefined}
      />

      <Section>
        <div className="container-page">
          <SectionHeader eyebrow="Upcoming" title="What is coming up next." />

          {upcomingItems.some((event) => event.slug === aviationTourSlug) ? (
            <div className="mt-10">
              <AviationTourPromo />
            </div>
          ) : null}

          {upcomingItems.length === 0 ? (
            <EmptyState
              className="mt-12"
              icon={CalendarDays}
              title="No events scheduled right now"
              description="We are between programmes. Subscribe to the term update and you will hear about the next one before it is announced anywhere else."
              action={{ label: "Get Quotation", href: routes.quotation }}
            />
          ) : (
            <RevealGroup as="ul" className="mt-12 grid gap-5">
              {upcomingItems.map((event) => (
                <RevealItem as="li" key={event.id}>
                  <EventCard event={event} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </Section>

      {pastItems.length > 0 ? (
        <Section tone="surface">
          <div className="container-page">
            <SectionHeader
              eyebrow="Already happened"
              title="Where we have been."
              description="Photographs from these are in the gallery."
            />
            <RevealGroup as="ul" className="mt-12 grid gap-5">
              {pastItems.map((event) => (
                <RevealItem as="li" key={event.id}>
                  <EventCard event={event} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      <Section size="sm">
        <CtaBand
          title="Cannot travel to us? We will come to you."
          description="We deliver aviation modules at schools across Kenya and organise field trips after the modules. Get Quotation for your group and preferred dates."
          primary={{ label: "Get Quotation", href: routes.quotation }}
          secondary={{ label: "See the gallery", href: routes.gallery }}
        />
      </Section>
    </>
  );
}
