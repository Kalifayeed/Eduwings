import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";

import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { formatDateTime } from "@/lib/utils";
import { requestTime } from "@/lib/time";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, eventSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Section } from "@/components/marketing/section";
import { MarkdownContent } from "@/components/content/markdown";
import { AppImage } from "@/components/media/app-image";
import { EventCard, availabilityOf } from "@/components/cards/event-card";
import { EventRegistrationForm } from "@/components/forms/event-registration-form";
import { ShareRow } from "@/components/content/share-row";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getContentSource().events.slugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = await getContentSource().events.bySlug(slug);

  if (!event) {
    return buildMetadata({
      title: "Event not found",
      description: "This event could not be found.",
      path: routes.event(slug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: event.title,
    description: event.summary,
    path: routes.event(event.slug),
    image: event.coverImage ?? undefined,
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const source = getContentSource();
  const event = await source.events.bySlug(slug);

  if (!event) notFound();

  const others = await source.events.list({ when: "upcoming", limit: 4 });
  const related = others.items.filter((item) => item.slug !== event.slug).slice(0, 2);

  const breadcrumbs = [
    { label: "Home", href: routes.home },
    { label: "Events", href: routes.events },
    { label: event.title, href: routes.event(event.slug) },
  ];

  const isPast = new Date(event.endsAt ?? event.startsAt).getTime() < requestTime();
  const availability = availabilityOf(event);
  const filledPercent = event.capacity ? (event.seatsTaken / event.capacity) * 100 : 0;
  const seatsRemaining = event.capacity ? Math.max(0, event.capacity - event.seatsTaken) : null;
  const canRegister =
    !isPast && event.registrationOpen && (seatsRemaining === null || seatsRemaining > 0);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(breadcrumbs),
          eventSchema({
            title: event.title,
            description: event.summary,
            path: routes.event(event.slug),
            startsAt: event.startsAt,
            endsAt: event.endsAt,
            venue: event.venue,
            locality: event.locality,
            isOnline: event.isOnline,
            isFree: event.priceKes === null,
          }),
        )}
      />

      <div className="relative overflow-hidden border-b bg-aurora">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        <div className="relative container-page pt-10 pb-14">
          <Breadcrumb items={breadcrumbs} className="mb-8" />

          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{event.type}</Badge>
                {isPast ? (
                  <Badge variant="muted">This event has taken place</Badge>
                ) : (
                  <Badge variant={availability.variant}>{availability.label}</Badge>
                )}
                {event.priceKes === null ? <Badge variant="success">Free</Badge> : null}
              </div>

              <h1 className="mt-6 font-display text-3xl leading-[1.08] font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {event.summary}
              </p>

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3">
                  <CalendarDays aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                      Starts
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">
                      <time dateTime={event.startsAt}>{formatDateTime(event.startsAt)}</time>
                    </dd>
                  </div>
                </div>

                {event.endsAt ? (
                  <div className="flex gap-3">
                    <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                        Ends
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium">
                        <time dateTime={event.endsAt}>{formatDateTime(event.endsAt)}</time>
                      </dd>
                    </div>
                  </div>
                ) : null}

                <div className="flex gap-3">
                  <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs tracking-wide text-muted-foreground uppercase">Where</dt>
                    <dd className="mt-0.5 text-sm font-medium">
                      {event.venue}
                      {!event.isOnline ? `, ${event.locality}` : ""}
                    </dd>
                  </div>
                </div>

                {event.capacity ? (
                  <div className="flex gap-3">
                    <Users aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                        Capacity
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium">{event.capacity} places</dd>
                    </div>
                  </div>
                ) : null}
              </dl>

              <div className="mt-8">
                <ShareRow title={event.title} path={routes.event(event.slug)} />
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[var(--shadow-float)]">
                <AppImage
                  src={event.coverImage}
                  alt=""
                  seed={event.slug}
                  motif={event.isOnline ? "world" : "tower"}
                  priority
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  className="size-full"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <Reveal>
            <MarkdownContent content={event.body} />

            <Button asChild variant="ghost" className="mt-10">
              <Link href={routes.events}>
                <ArrowLeft className="size-4" />
                All events
              </Link>
            </Button>
          </Reveal>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Reveal className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]">
              {event.capacity ? (
                <div className="mb-7">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold">
                      {event.seatsTaken} of {event.capacity} places taken
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {Math.round(filledPercent)}%
                    </p>
                  </div>
                  <Progress value={filledPercent} className="mt-3" />
                </div>
              ) : null}

              {canRegister ? (
                <>
                  <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                    <Ticket aria-hidden className="size-5 text-primary" />
                    Register
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Free. We will confirm your place by email.
                  </p>
                  <EventRegistrationForm eventSlug={event.slug} className="mt-6" />
                </>
              ) : (
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    {isPast ? "This event has taken place" : "Registration is closed"}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {isPast
                      ? "Photographs from this event are in the gallery, and we would be glad to bring the same programme to your school."
                      : "This event is fully subscribed. Contact us to join the waiting list — we offer returned places first to schools that have not previously attended."}
                  </p>
                  <div className="mt-6 grid gap-3">
                    <Button asChild>
                      <Link href={routes.schools}>Request a school visit</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={isPast ? routes.gallery : routes.contact}>
                        {isPast ? "See the gallery" : "Join the waiting list"}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </Reveal>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="surface">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Also coming up
            </h2>
            <RevealGroup as="ul" className="mt-10 grid gap-5">
              {related.map((item) => (
                <RevealItem as="li" key={item.id}>
                  <EventCard event={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}
    </>
  );
}
