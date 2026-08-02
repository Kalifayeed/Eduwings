import Link from "next/link";
import { ArrowRight, Mail, Phone, Quote } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import {
  impactStatistics,
  mission,
  objectives,
  timeline,
  vision,
  whyItMatters,
} from "@/lib/content/editorial";
import { Icon } from "@/components/icon";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { StatGrid } from "@/components/marketing/stat-grid";
import { CtaBand } from "@/components/marketing/cta-band";
import { AppImage } from "@/components/media/app-image";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "About", href: routes.about },
];

export const metadata = buildMetadata({
  title: "About EduWings",
  description:
    "How EduWings began, what it is trying to change, and the founder who started it after a question nobody in the room could answer.",
  path: routes.about,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="About EduWings"
        title="It started with a question nobody could answer."
        description="A Form Two student asked how someone becomes an aircraft engineer. Every adult in that room — teachers, guests, a careers advisor — knew it was a real job. Not one of them could describe how to get it."
        breadcrumbs={BREADCRUMBS}
        actions={
          <>
            <Button asChild size="lg">
              <Link href={routes.schools}>
                Bring us to your school
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={routes.program}>See the programme</Link>
            </Button>
          </>
        }
      />

      {/* ── Mission and vision ──────────────────────────────────────────── */}
      <Section>
        <div className="container-page grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-3xl border bg-card p-8 shadow-[var(--shadow-soft)] sm:p-10">
            <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">
              Our mission
            </p>
            <p className="mt-5 font-display text-xl leading-snug font-semibold text-balance sm:text-2xl">
              {mission}
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="rounded-3xl bg-gradient-to-br from-sky-700 to-navy-900 p-8 text-white shadow-[var(--shadow-lift)] sm:p-10 dark:from-sky-900 dark:to-navy-950"
          >
            <p className="font-mono text-xs tracking-[0.18em] text-gold-300 uppercase">
              Our vision
            </p>
            <p className="mt-5 font-display text-xl leading-snug font-semibold text-balance sm:text-2xl">
              {vision}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ── Founder ─────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[var(--shadow-float)]">
              <AppImage
                src={null}
                alt={`${siteConfig.founder.name}, ${siteConfig.founder.role}`}
                seed="founder-portrait"
                motif="students"
                tone="gold"
                label="Founder"
                sizes="(min-width: 1024px) 28rem, 100vw"
                className="size-full"
              />
            </div>
          </Reveal>

          <div>
            <SectionHeader
              eyebrow="The founder"
              title={siteConfig.founder.name}
              description={
                <>
                  <p className="font-medium text-foreground">{siteConfig.founder.role}</p>
                  <p className="mt-5">{siteConfig.founder.bio}</p>
                </>
              }
            />

            <Reveal delay={0.1}>
              <figure className="mt-8 border-l-4 border-accent pl-6">
                <Quote aria-hidden className="size-6 text-accent" />
                <blockquote className="mt-3">
                  <p className="text-lg leading-relaxed font-medium text-balance">
                    I had spent ten years in this industry and I could not answer a fifteen-year-old
                    asking how to enter it. Not because the answer is complicated — because nobody
                    had ever written it down for someone like her.
                  </p>
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  {siteConfig.founder.name}, on the conversation that started EduWings
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.16} className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href={`tel:${siteConfig.founder.phoneE164}`}>
                  <Phone className="size-4" />
                  {siteConfig.founder.phone}
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href={routes.contact}>
                  <Mail className="size-4" />
                  Get in touch
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ── Objectives ──────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="Our objectives"
            title="Six things we are trying to do, stated plainly."
            description="Each one is measurable. We report against them honestly, including where we fall short."
          />

          <RevealGroup as="ul" className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {objectives.map((objective) => {
              return (
                <RevealItem
                  as="li"
                  key={objective.title}
                  className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={objective.icon} className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg leading-snug font-semibold">
                    {objective.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {objective.body}
                  </p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Timeline ────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="How we got here"
            title="From one borrowed projector to eighty-six schools."
          />

          <RevealGroup as="ol" className="relative mt-14 max-w-3xl">
            {/* Vertical rail — decorative, so hidden from assistive technology. */}
            <span
              aria-hidden
              className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-primary/50 via-primary/25 to-transparent"
            />

            {timeline.map((entry) => (
              <RevealItem
                as="li"
                key={`${entry.year}-${entry.title}`}
                className="relative pb-10 pl-10 last:pb-0"
              >
                <span
                  aria-hidden
                  className="absolute top-1.5 left-0 size-4 rounded-full border-4 border-background bg-primary"
                />
                <p className="font-mono text-sm font-medium text-primary">{entry.year}</p>
                <h3 className="mt-1.5 font-display text-lg leading-snug font-semibold">
                  {entry.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{entry.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Why it matters ──────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="Why EduWings matters"
            title="The case for doing this, and doing it properly."
            align="center"
          />

          <RevealGroup as="ul" className="mt-14 grid gap-6 md:grid-cols-2">
            {whyItMatters.map((argument) => {
              return (
                <RevealItem
                  as="li"
                  key={argument.title}
                  className="flex gap-5 rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent/15 text-gold-700 dark:text-gold-300">
                    <Icon name={argument.icon} className="size-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg leading-snug font-semibold">
                      {argument.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {argument.body}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>

          <div className="mt-16">
            <StatGrid stats={impactStatistics} />
          </div>
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          title="We would rather be in a classroom than on a website."
          description="If you teach, lead a school, or work in aviation and can spare a few days a year — that is the whole ask."
          primary={{ label: "Request a school visit", href: routes.schools }}
          secondary={{ label: "Volunteer with us", href: routes.volunteer }}
        />
      </Section>
    </>
  );
}
