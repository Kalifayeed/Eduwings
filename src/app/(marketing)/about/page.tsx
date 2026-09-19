import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import {
  journeyStages,
  mission,
  objectives,
  ourStory,
  timeline,
  vision,
} from "@/lib/content/editorial";
import { Icon } from "@/components/icon";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { AppImage } from "@/components/media/app-image";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "About", href: routes.about },
];

export const metadata = buildMetadata({
  title: "About EduWings",
  description:
    "Discover how Meldah Magova founded Eduwings to help young learners explore aviation careers through early exposure, mentorship, and hands-on learning.",
  path: routes.about,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="About EduWings"
        title="Opening aviation's possibilities to young learners."
        description="Through her work in education, Meldah Magova saw a need for earlier exposure to aviation careers. Eduwings helps learners explore those possibilities from as early as Grade 4."
        breadcrumbs={BREADCRUMBS}
        actions={
          <>
            <Button asChild size="lg">
              <Link href={routes.quotation}>
                Get Quotation
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
        <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal className="mx-auto w-full max-w-[35rem] lg:max-w-none">
            <div className="relative aspect-[1123/1401] overflow-hidden rounded-3xl shadow-[var(--shadow-float)]">
              <AppImage
                src={siteConfig.founder.image}
                alt={`${siteConfig.founder.name}, ${siteConfig.founder.role}`}
                seed="founder-portrait"
                motif="students"
                tone="gold"
                label="Founder"
                sizes="(min-width: 1440px) 548px, (min-width: 1024px) calc(42.5vw - 64.6px), (min-width: 600px) 560px, calc(100vw - 40px)"
                quality={90}
                className="size-full"
              />
            </div>
          </Reveal>

          <div>
            <SectionHeader
              eyebrow={siteConfig.founder.name}
              title="Our Story"
              description={siteConfig.founder.role}
            />

            <Reveal
              delay={0.1}
              className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {ourStory.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
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

      {/* ── How we work ─────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="How we work"
            title="Awareness → Exposure → Guidance → Experience → Career Direction."
            description="Every school engagement moves a student through the same five stages, whether it takes an afternoon or a year."
            align="center"
          />

          <RevealGroup as="ol" className="relative mt-14 grid gap-6 md:grid-cols-5">
            {journeyStages.map((item, index) => (
              <RevealItem
                as="li"
                key={item.stage}
                className="relative flex flex-col rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <span className="font-mono text-xs tracking-[0.18em] text-primary uppercase">
                  {String(index + 1).padStart(2, "0")} · {item.stage}
                </span>
                <span className="mt-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={item.icon} className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-base leading-snug font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          title="We would rather be in a classroom than on a website."
          description="If you teach, lead a school, or work in aviation and can spare a few days a year — that is the whole ask."
          primary={{ label: "Get Quotation", href: routes.quotation }}
          secondary={{ label: "Volunteer with us", href: routes.volunteer }}
        />
      </Section>
    </>
  );
}
