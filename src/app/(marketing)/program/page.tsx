import { ServicePricing } from "@/components/marketing/service-pricing";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, GraduationCap } from "lucide-react";

import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import {
  formatProgramDuration,
  getModuleSchedules,
  programLevels,
} from "@/lib/content/program-levels";
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

export const metadata = buildMetadata({
  title: "Our Programme",
  description:
    "Explore seven Primary & Junior level modules and five Secondary & Senior level modules, with aviation topics and teaching times tailored to each level.",
  path: routes.program,
});

export default async function ProgramPage() {
  const modules = await getContentSource().programs.list();
  const availableSlugs = new Set(modules.items.map((module) => module.slug));
  const levels = programLevels.map((level) => ({
    ...level,
    modules: level.modules.filter((module) => availableSlugs.has(module.slug)),
  }));
  const curriculumModules = modules.items.filter(
    (module) => getModuleSchedules(module.slug).length > 0,
  );

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="The programme"
        title="Aviation learning for every school level."
        description="Aviation modules delivered at your school, followed by an organised field trip to a facility with simulators. Get Quotation for teaching and separately itemised field-trip costs."
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
              <Link href={routes.activities}>See the activities</Link>
            </Button>
          </>
        }
        aside={
          <dl className="grid gap-px overflow-hidden rounded-2xl border bg-border bg-card shadow-[var(--shadow-soft)] sm:grid-cols-3 lg:grid-cols-1">
            {levels.map((level) => (
              <div key={level.id} className="bg-card p-5">
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  {level.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold">
                  {level.modules.length} modules
                </dd>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {formatProgramDuration(
                    level.modules.reduce((sum, module) => sum + module.durationMinutes, 0),
                  )}{" "}
                  total
                </dd>
              </div>
            ))}
            <div className="bg-card p-5">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Cost to schools
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-primary">
                <Link href={routes.quotation} className="hover:underline">
                  Get Quotation
                </Link>
              </dd>
            </div>
          </dl>
        }
      />

      {/* ── How it is delivered ─────────────────────────────────────────── */}
      <ServicePricing />

      <Section size="sm">
        <div className="container-page">
          <RevealGroup as="ul" className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "We come to you",
                body: "Our facilitators deliver the modules at your school using teaching materials and classroom activities. Schools provide a suitable room, power and a projection surface.",
              },
              {
                title: "Shaped around your timetable",
                body: "Choose modules for your learners and arrange sessions around your timetable. The durations below show the teaching time for each module and school level.",
              },
              {
                title: "A field trip after the modules",
                body: "EduWings organises a separately quoted visit to an aviation facility with simulators after the modules. Simulator demonstrations or hands-on access take place there, subject to the host’s availability, age requirements and capacity.",
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
            eyebrow="Learning by school level"
            title="Modules and teaching times for your learners."
            description="Choose the programme for your school level. Each list shows the modules in order and the teaching time for each."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {levels.map((level, index) => (
              <Reveal
                key={level.id}
                delay={index * 0.08}
                className="rounded-2xl border bg-card p-7"
              >
                <h3 className="font-display text-lg font-semibold">{level.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {level.description}
                </p>
                <ul className="mt-5 grid gap-3">
                  {level.modules.map((module) => (
                    <li key={module.slug} className="text-sm leading-relaxed">
                      <a href={`#${module.slug}`} className="text-primary hover:underline">
                        {module.title}
                      </a>
                      <span className="text-muted-foreground">
                        {" – "}
                        {formatProgramDuration(module.durationMinutes)}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Modules ─────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="The curriculum"
            title="Explore the topics in each programme."
            description="Use the school-level lists above to follow your programme. Shared topics have different teaching times to suit each level."
          />

          <div className="mt-16 grid gap-16">
            {curriculumModules.map((module, index) => {
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
                      {getModuleSchedules(module.slug).map((schedule) => (
                        <Badge
                          key={schedule.level}
                          variant="secondary"
                          className="text-left whitespace-normal"
                        >
                          <Clock className="size-3.5 shrink-0" aria-hidden />
                          {schedule.level}: {formatProgramDuration(schedule.durationMinutes)}
                        </Badge>
                      ))}
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
          eyebrow="Get Quotation"
          title="Book the programme for your students."
          description="Tell us your school’s location, year groups, learner numbers and dates. We will itemise the programme fee and any field-trip, transport and facility charges."
          primary={{ label: "Get Quotation", href: routes.quotation }}
          secondary={{ label: "See the fourteen careers", href: routes.careers }}
        />
      </Section>
    </>
  );
}
