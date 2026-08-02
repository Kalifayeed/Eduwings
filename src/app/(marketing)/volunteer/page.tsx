import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { VolunteerForm } from "@/components/forms/volunteer-form";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Volunteer", href: routes.volunteer },
];

export const metadata = buildMetadata({
  title: "Volunteer",
  description:
    "If you work in aviation in any capacity, two to four days a year is enough. You do not need teaching experience — students want to meet someone who does the job.",
  path: routes.volunteer,
});

const EXPECTATIONS = [
  {
    title: "Two to four days a year",
    body: "That is the typical commitment, and it is genuinely enough. Some volunteers do one day; some do a dozen. You choose, term by term.",
  },
  {
    title: "No teaching experience needed",
    body: "You are not being asked to teach. You are being asked to answer questions honestly about a job you already do. That is the entire skill requirement.",
  },
  {
    title: "You shadow before you lead",
    body: "Every volunteer sits in on a session before running one. Nobody is dropped in front of two hundred students unprepared.",
  },
  {
    title: "A background check applies",
    body: "Standard safeguarding practice for anyone working with students. We explain the process when we speak, and we cover the cost.",
  },
];

const NEEDS = [
  "Pilots — commercial, private, instructional, any fleet",
  "Licensed engineers and avionics technicians",
  "Air traffic controllers and dispatchers",
  "Cabin crew and ground operations staff",
  "Meteorologists and aviation security professionals",
  "Remote pilots and aerospace engineers",
  "Anyone who works airside and can describe what they see",
];

export default async function VolunteerPage() {
  const { items: testimonials } = await getContentSource().testimonials.list({ limit: 6 });

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Volunteer"
        title="Twenty minutes with you outperforms any lesson we could write."
        description="Students stop listening to explanations about aviation the moment someone who actually does it walks in. If you work in this industry in any capacity, you are the most valuable thing we can bring into a classroom."
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── What is expected ────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="What it involves"
            title="Four things worth knowing before you apply."
          />

          <RevealGroup as="ul" className="mt-14 grid gap-6 sm:grid-cols-2">
            {EXPECTATIONS.map((item, index) => (
              <RevealItem
                as="li"
                key={item.title}
                className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
              >
                <p className="font-display text-4xl font-bold text-primary/30">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-lg leading-snug font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Who we need + form ──────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeader eyebrow="Who we are looking for" title="Almost certainly you." />

            <RevealGroup as="ul" className="mt-8 grid gap-3">
              {NEEDS.map((need) => (
                <RevealItem as="li" key={need} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{need}</span>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1} className="mt-8 rounded-2xl border bg-card p-6">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Not in aviation?</span> We still want to hear from
                you. Photographers, drivers, teachers and people who can help us reach schools we
                have not found yet are all genuinely useful.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.06}>
            <div className="rounded-3xl border bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10">
              <h2 className="font-display text-2xl font-bold tracking-tight">Apply to volunteer</h2>
              <p className="mt-2.5 leading-relaxed text-muted-foreground">
                This takes about three minutes. We will call you for a short conversation — not a
                formal interview.
              </p>
              <VolunteerForm className="mt-8" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      {testimonials.length > 0 ? (
        <Section>
          <div className="container-page">
            <SectionHeader
              eyebrow="From the classroom"
              title="What volunteers and schools say afterwards."
            />
            <div className="mt-14">
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}
