import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, GraduationCap } from "lucide-react";

import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { programOutcomes } from "@/lib/content/static/programs";
import { Icon } from "@/components/icon";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarkdownContent } from "@/components/content/markdown";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Our Programme", href: routes.program },
];

/**
 * Which school level each module is pitched at. Kept as a small local lookup
 * rather than a field on `ProgramModule` — that type is shared with the
 * Supabase-backed content source, and this framing is presentation-only for
 * this one page, not something the CMS needs to manage.
 */
const MODULE_AUDIENCE: Record<string, "primary" | "secondary" | "both"> = {
  "history-of-flight": "primary",
  "how-airplanes-fly": "both",
  "airport-operations": "primary",
  navigation: "secondary",
  "weather-and-flight": "both",
  "safety-culture": "primary",
  "stem-in-aviation": "both",
  "career-pathways": "both",
};

export const metadata = buildMetadata({
  title: "Our Programme",
  description:
    "Eight modules covering the history of flight, how aircraft fly, airport operations, navigation, weather, safety, STEM and career pathways — mapped to CBC learning outcomes.",
  path: routes.program,
});

export default async function ProgramPage() {
  const modules = await getContentSource().programs.list();
  const totalMinutes = modules.items.reduce((sum, module) => sum + module.durationMinutes, 0);

  const primaryModules = modules.items.filter((module) => {
    const audience = MODULE_AUDIENCE[module.slug] ?? "both";
    return audience === "primary" || audience === "both";
  });
  const secondaryModules = modules.items.filter((module) => {
    const audience = MODULE_AUDIENCE[module.slug] ?? "both";
    return audience === "secondary" || audience === "both";
  });

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="The programme"
        title="An aircraft, taken apart into eight lessons."
        description="The full EduWings curriculum. Delivered in your classroom by working aviation professionals, mapped against CBC learning outcomes, and free to every school."
        breadcrumbs={BREADCRUMBS}
        actions={
          <>
            <Button asChild size="lg">
              <Link href={routes.schools}>
                Request a visit
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={routes.activities}>See the activities</Link>
            </Button>
          </>
        }
        aside={
          <dl className="grid gap-px overflow-hidden rounded-2xl border bg-border bg-card shadow-[var(--shadow-soft)] sm:grid-cols-3 lg:grid-cols-1">
            <div className="bg-card p-5">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Modules</dt>
              <dd className="mt-1 font-display text-2xl font-bold">{modules.total}</dd>
            </div>
            <div className="bg-card p-5">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Total teaching time
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold">
                {Math.round((totalMinutes / 60) * 10) / 10} hrs
              </dd>
            </div>
            <div className="bg-card p-5">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Cost to schools
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-primary">Free</dd>
            </div>
          </dl>
        }
      />

      {/* ── How it is delivered ─────────────────────────────────────────── */}
      <Section size="sm">
        <div className="container-page">
          <RevealGroup as="ul" className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "We come to you",
                body: "Anywhere in Kenya. We bring the simulators, the materials and the professionals. You provide a room, a socket and a wall.",
              },
              {
                title: "Shaped around your timetable",
                body: "The full programme runs across two to three hours, but modules are independent. A single lesson period works.",
              },
              {
                title: "Taught by people who do the job",
                body: "Every session is co-delivered by a working pilot, licensed engineer, controller or dispatcher. That is the mechanism, not the garnish.",
              },
            ].map((item) => (
              <RevealItem as="li" key={item.title} className="rounded-2xl border bg-card p-7">
                <CheckCircle2 aria-hidden className="size-6 text-primary" />
                <h2 className="mt-4 font-display text-lg font-semibold">{item.title}</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Who each part is for ────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="Primary or secondary?"
            title="The same eight modules, pitched differently by age."
            description="We adjust depth, not content — the physics of lift is the same at ten and at seventeen, but the conversation is not."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal className="rounded-2xl border bg-card p-7">
              <h3 className="font-display text-lg font-semibold">Primary &amp; Junior School</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Exposure, curiosity and early awareness — introducing aviation, airports and
                aircraft before career pressure sets in.
              </p>
              <ul className="mt-5 grid gap-2.5">
                {primaryModules.map((module) => (
                  <li key={module.id}>
                    <a href={`#${module.slug}`} className="text-sm text-primary hover:underline">
                      {module.title}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="rounded-2xl border bg-card p-7">
              <h3 className="font-display text-lg font-semibold">Secondary &amp; Senior School</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Career-focused — subjects, entry requirements, qualifications and the pathway from
                KCSE into aviation training.
              </p>
              <ul className="mt-5 grid gap-2.5">
                {secondaryModules.map((module) => (
                  <li key={module.id}>
                    <a href={`#${module.slug}`} className="text-sm text-primary hover:underline">
                      {module.title}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ── Modules ─────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="The curriculum"
            title="Eight modules, taught in this order."
            description="Each one assumes the one before it. Together they take a student from 'aircraft are magic' to a written career pathway."
          />

          <div className="mt-16 grid gap-16">
            {modules.items.map((module, index) => {
              return (
                <Reveal
                  as="article"
                  key={module.id}
                  id={module.slug}
                  className="grid scroll-mt-32 gap-10 lg:grid-cols-[1fr_1.4fr]"
                >
                  <div className="lg:sticky lg:top-32 lg:self-start">
                    <div className="flex items-center gap-4">
                      <span className="grid size-12 place-items-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon name={module.icon} aria-hidden className="size-7 text-primary" />
                    </div>

                    <h3 className="mt-6 font-display text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                      {module.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{module.summary}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        <Clock className="size-3.5" aria-hidden />
                        {module.durationMinutes} min
                      </Badge>
                      {module.curriculumLinks.map((link) => (
                        <Badge key={link} variant="outline">
                          <GraduationCap className="size-3.5" aria-hidden />
                          {link}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <MarkdownContent content={module.body} />

                    <div className="mt-8 rounded-2xl border bg-card p-6">
                      <h4 className="font-mono text-xs tracking-[0.18em] text-primary uppercase">
                        Learning outcomes
                      </h4>
                      <ul className="mt-4 grid gap-2.5">
                        {module.learningOutcomes.map((outcome) => (
                          <li key={outcome} className="flex gap-3 text-sm leading-relaxed">
                            <CheckCircle2
                              aria-hidden
                              className="mt-0.5 size-4 shrink-0 text-primary"
                            />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ── Outcomes ────────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="Expected outcomes"
            title="What a school should expect to see afterwards."
            description="We measure these. Where a claim is soft, we say so."
            align="center"
          />

          <RevealGroup as="ul" className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
            {programOutcomes.map((outcome) => (
              <RevealItem
                as="li"
                key={outcome.title}
                className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
              >
                <h3 className="font-display text-lg leading-snug font-semibold">{outcome.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {outcome.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          eyebrow="Free to schools"
          title="Book the programme for your students."
          description="Tell us the school, the year groups and roughly when. We will handle the rest."
          primary={{ label: "Request a school visit", href: routes.schools }}
          secondary={{ label: "See the fourteen careers", href: routes.careers }}
        />
      </Section>
    </>
  );
}
