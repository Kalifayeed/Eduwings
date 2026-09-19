import { ServicePricing } from "@/components/marketing/service-pricing";
import { Building2, CheckCircle2, MapPin, Plane, Users } from "lucide-react";

import { routes } from "@/config/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { AviationVisitForm } from "@/components/forms/aviation-visit-form";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Aviation Visits", href: routes.visit },
];

export const metadata = buildMetadata({
  title: "Plan an Aviation Learning Visit",
  description:
    "Get Quotation for an organised aviation field trip after your modules. Visits to simulator facilities are subject to host availability, access requirements and agreed costs.",
  path: routes.visit,
});

const REQUIREMENTS = [
  {
    icon: Plane,
    title: "Real aviation environments",
    body: "Airports, airstrips, aviation colleges and training facilities across Kenya.",
  },
  {
    icon: Users,
    title: "School groups of any size",
    body: "Tell us how many students and teachers — we match the destination to your group.",
  },
  {
    icon: MapPin,
    title: "Not sure where?",
    body: "Choose 'Not sure — advise us' and we will recommend a destination that fits your goals.",
  },
  {
    icon: Building2,
    title: "This is a request, not a booking",
    body: "We check host availability and prepare an itemised quotation before any booking is confirmed.",
  },
];

export default function VisitPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Aviation visits"
        title="See it in person. We will help you get there."
        description="After the school-based modules, EduWings organises a field trip to an aviation facility with simulators. Simulator demonstrations or hands-on sessions take place at the host facility, subject to availability, age requirements and capacity. The field trip is quoted separately from classroom teaching."
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── What is required ────────────────────────────────────────────── */}
      <ServicePricing tripOnly />

      <Section size="sm">
        <div className="container-page">
          <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REQUIREMENTS.map((item) => (
              <RevealItem as="li" key={item.title} className="rounded-2xl border bg-card p-6">
                <item.icon aria-hidden className="size-6 text-primary" />
                <h2 className="mt-4 font-display text-base font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeader
              eyebrow="How it works"
              title="We check feasibility before anything is confirmed."
            />

            <RevealGroup as="ol" className="relative mt-10">
              <span
                aria-hidden
                className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-primary/50 via-primary/25 to-transparent"
              />
              {[
                {
                  title: "You send the form",
                  body: "Destination type, purpose, group size and roughly when. Five minutes.",
                },
                {
                  title: "We reply within three working days",
                  body: "We acknowledge your quotation request and check the host’s availability, access conditions and charges.",
                },
                {
                  title: "We match you to a destination",
                  body: "If you are not sure where to go, we recommend one that fits your group and goals.",
                },
                {
                  title: "You approve the quotation and arrangements",
                  body: "We itemise coordination, transport, facility access and other agreed costs. Dates and simulator activities are confirmed only after your approval and the host’s confirmation.",
                },
              ].map((step) => (
                <RevealItem as="li" key={step.title} className="relative pb-8 pl-10 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute top-1.5 left-0 size-4 rounded-full border-4 border-background bg-primary"
                  />
                  <h3 className="font-display text-base font-semibold">{step.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">{step.body}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-10 rounded-2xl border bg-card p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Need a quotation for the school-based modules as well?{" "}
                <a href={routes.quotation} className="font-medium text-primary underline">
                  Get Quotation for school modules →
                </a>
              </p>
            </Reveal>
          </div>

          <Reveal
            id="request"
            className="scroll-mt-32 rounded-3xl border bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10"
          >
            <h2 className="font-display text-2xl font-bold tracking-tight">Get Quotation</h2>
            <p className="mt-2.5 leading-relaxed text-muted-foreground">
              Tell us your group size, completed or planned modules, and preferred dates. Your
              quotation will identify transport, facility charges, meals and any other inclusions. A
              request is not a confirmed booking.
            </p>
            <AviationVisitForm className="mt-8" />
          </Reveal>
        </div>
      </Section>

      <Reveal className="container-page">
        <p className="mx-auto flex max-w-2xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <CheckCircle2 aria-hidden className="size-4 text-success" />
          Still unsure what to ask for? Call us — the number is in the footer of every page.
        </p>
      </Reveal>

      <CtaBand
        eyebrow="Plan your programme"
        title="Explore what your students could discover first."
        description="Explore fourteen aviation career catalogues, with study routes, qualifications and opportunities."
        primary={{ label: "Explore aviation careers", href: routes.careers }}
        secondary={{ label: "Get Quotation", href: routes.quotation }}
      />
    </>
  );
}
