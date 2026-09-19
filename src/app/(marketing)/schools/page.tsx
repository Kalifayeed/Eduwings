import { ServicePricing } from "@/components/marketing/service-pricing";
import { CheckCircle2, Clock, MapPin, School as SchoolIcon, Users } from "lucide-react";

import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { faqs } from "@/lib/content/editorial";
import { formatCompactNumber, formatDate } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { SchoolRequestForm } from "@/components/forms/school-request-form";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "For Schools", href: routes.schools },
];

const SCHOOL_FAQS = faqs.filter((faq) => faq.audience === "Schools");

export const metadata = buildMetadata({
  title: "For Schools",
  description:
    "Get Quotation for EduWings aviation modules at your school and an organised field trip to a simulator facility after the modules. Fees depend on your group, location and programme.",
  path: routes.schools,
});

const REQUIREMENTS = [
  {
    icon: Clock,
    title: "A timetable for your modules",
    body: "Module times vary by school level. We agree the number of sessions, teaching dates and field-trip schedule in your quotation.",
  },
  {
    icon: Users,
    title: "Grade 4 to Form 4",
    body: "Choose the Primary & Junior or Secondary & Senior modules, with teaching times appropriate to each level.",
  },
  {
    icon: MapPin,
    title: "Anywhere in Kenya",
    body: "We prioritise schools with the least existing exposure to the industry, which is often the furthest away.",
  },
  {
    icon: SchoolIcon,
    title: "A room, a socket, a wall",
    body: "We bring facilitators and teaching materials. Simulator visits take place at an aviation facility during the field trip after the modules.",
  },
];

export default async function SchoolsPage() {
  const { items: schools } = await getContentSource().schools.list({ limit: 12 });

  const totalStudents = schools.reduce((sum, school) => sum + school.studentsReached, 0);
  const counties = [...new Set(schools.map((school) => school.county))];

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(BREADCRUMBS),
          faqSchema(SCHOOL_FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }))),
        )}
      />

      <PageHero
        eyebrow="For schools"
        title="Aviation learning planned for your school."
        description="Get Quotation for school-based modules, career guidance and an organised field trip after the modules. Your quotation sets out the teaching fees, schedule, group size and any transport or host-facility charges before you book."
        breadcrumbs={BREADCRUMBS}
        aside={
          <dl className="grid gap-px overflow-hidden rounded-2xl border bg-border bg-card shadow-[var(--shadow-soft)] sm:grid-cols-3 lg:grid-cols-1">
            <div className="bg-card p-5">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Schools visited
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold">86</dd>
            </div>
            <div className="bg-card p-5">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Students reached
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold">
                {formatCompactNumber(12400)}+
              </dd>
            </div>
            <div className="bg-card p-5">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Cost to schools
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-primary">
                <a href={routes.quotation} className="hover:underline">
                  Get Quotation
                </a>
              </dd>
            </div>
          </dl>
        }
      />

      {/* ── What is required ────────────────────────────────────────────── */}
      <ServicePricing />

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
              title="From quotation to classroom learning and a field trip."
            />

            <RevealGroup as="ol" className="relative mt-10">
              <span
                aria-hidden
                className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-primary/50 via-primary/25 to-transparent"
              />
              {[
                {
                  title: "You send the form",
                  body: "School name, county, year groups and roughly when. Five minutes.",
                },
                {
                  title: "We reply within three working days",
                  body: "We discuss your group, modules and dates, then prepare an itemised quotation.",
                },
                {
                  title: "You approve the programme and quotation",
                  body: "We agree the teaching schedule, fees and arrangements, then provide the curriculum mapping for your teachers.",
                },
                {
                  title: "Modules at school, then a field trip",
                  body: "Our facilitators deliver the school-based modules. Afterwards, EduWings organises the separately quoted visit to a facility with simulators, subject to host approval and availability.",
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
                Planning the field trip after your modules?{" "}
                <a href={routes.visitQuotation} className="font-medium text-primary underline">
                  Get Quotation for the field trip →
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
              Tell us your requirements so we can prepare a quotation. Submitting this form does not
              confirm a booking.
            </p>
            <SchoolRequestForm className="mt-8" />
          </Reveal>
        </div>
      </Section>

      {/* ── Participating schools ───────────────────────────────────────── */}
      {schools.length > 0 ? (
        <Section>
          <div className="container-page">
            <SectionHeader
              eyebrow="Where we have been"
              title="Schools already taking part."
              description={`${counties.length} counties and ${formatCompactNumber(totalStudents)} students in this list alone.`}
            />

            <RevealGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schools.map((school) => (
                <RevealItem
                  as="li"
                  key={school.id}
                  className="flex flex-col rounded-2xl border bg-card p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base leading-snug font-semibold">
                      {school.name}
                    </h3>
                    <Badge variant="secondary" className="shrink-0">
                      {school.level}
                    </Badge>
                  </div>

                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin aria-hidden className="size-3.5" />
                    {school.town ? `${school.town}, ` : ""}
                    {school.county}
                  </p>

                  <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
                    <div>
                      <dt className="inline">Students reached: </dt>
                      <dd className="inline font-medium text-foreground">
                        {school.studentsReached}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline">Visits: </dt>
                      <dd className="inline font-medium text-foreground">{school.visitCount}</dd>
                    </div>
                    {school.firstVisitAt ? (
                      <div>
                        <dt className="inline">Since: </dt>
                        <dd className="inline font-medium text-foreground">
                          {formatDate(school.firstVisitAt, { month: "short", year: "numeric" })}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      {/* ── Questions ───────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="Questions from schools"
            title="The things head teachers ask us first."
            align="center"
          />

          <Reveal className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="rounded-2xl border bg-card px-6">
              {SCHOOL_FAQS.map((faq, index) => (
                <AccordionItem key={faq.question} value={`school-faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal className="mt-10 flex justify-center">
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 aria-hidden className="size-4 text-success" />
              Still unsure? Call us — the number is in the footer of every page.
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
