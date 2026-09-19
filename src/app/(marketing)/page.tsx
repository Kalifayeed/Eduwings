import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getContentSource } from "@/lib/content";
import { getFeaturedCareers } from "@/lib/content/careers";
import { activities, impactStatistics, whyItMatters } from "@/lib/content/editorial";
import { programModules } from "@/lib/content/static/programs";
import { formatProgramDuration, getModuleSchedules } from "@/lib/content/program-levels";
import { Icon } from "@/components/icon";
import { buildMetadata } from "@/lib/seo/metadata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Section, SectionHeader } from "@/components/marketing/section";
import { Hero } from "@/components/marketing/home/hero";
import { StatGrid } from "@/components/marketing/stat-grid";
import { CtaBand } from "@/components/marketing/cta-band";
import { PartnerStrip } from "@/components/marketing/partner-strip";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { CareerCard } from "@/components/cards/career-card";
import { EventCard } from "@/components/cards/event-card";
import { ArticleCard } from "@/components/cards/article-card";
import { AppImage } from "@/components/media/app-image";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.shortDescription,
  path: routes.home,
});

export default async function HomePage() {
  const source = getContentSource();

  // Fetched in parallel — these are independent and the page cannot render
  // until all of them resolve.
  const [testimonials, partners, upcomingEvents, articles] = await Promise.all([
    source.testimonials.list({ featured: true, limit: 6 }),
    source.partners.list({ limit: 8 }),
    source.events.list({ when: "upcoming", limit: 3 }),
    source.articles.list({ limit: 3 }),
  ]);

  const featuredCareers = getFeaturedCareers(6);

  return (
    <>
      <Hero />

      {/* ── The problem ─────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[var(--shadow-float)]">
              <AppImage
                src={null}
                alt="Students in a Kenyan classroom testing a model wing during an EduWings session"
                seed="home-classroom"
                motif="students"
                tone="day"
                label="Machakos County"
                sizes="(min-width: 1024px) 32rem, 100vw"
                className="size-full"
              />
            </div>
          </Reveal>

          <div>
            <SectionHeader
              eyebrow="The problem"
              title={
                <>
                  Ask a Kenyan classroom to name aviation jobs.
                  <span className="text-muted-foreground"> You will hear two.</span>
                </>
              }
              description={
                <>
                  <p>
                    Pilot. Cabin crew. That is the average answer across eighty-six schools — 2.1
                    careers named, out of at least fourteen that put an aircraft in the air every
                    single day.
                  </p>
                  <p className="mt-4">
                    This is not a failure of ambition. Students are not weighing a career as a
                    licensed engineer and rejecting it. The option was never on the list. Exposure,
                    not aptitude, is what decides which futures a child can picture.
                  </p>
                </>
              }
            />

            <Reveal delay={0.1} className="mt-10">
              <dl className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
                <div className="bg-card p-6">
                  <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                    Before a visit
                  </dt>
                  <dd className="mt-2 font-display text-4xl font-bold">2.1</dd>
                  <dd className="mt-1 text-sm text-muted-foreground">aviation careers named</dd>
                </div>
                <div className="bg-primary/5 p-6">
                  <dt className="text-xs tracking-wide text-primary uppercase">After a visit</dt>
                  <dd className="mt-2 font-display text-4xl font-bold text-primary">9.4</dd>
                  <dd className="mt-1 text-sm text-muted-foreground">aviation careers named</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ── Impact ──────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="Where we have reached"
            title="Three years, eighty-six schools, one repeated moment."
            description="The moment a student says: I did not know that was a job."
            align="center"
          />
          <StatGrid stats={impactStatistics} className="mt-14" />
        </div>
      </Section>

      {/* ── The programme ───────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="The programme"
            title="Aviation modules for every school level."
            description="Seven modules for Primary & Junior learners and five for Secondary & Senior learners, with teaching times tailored to each level. Delivered by aviation professionals. Get Quotation for your school’s programme."
          >
            <Button asChild variant="outline" size="lg">
              <Link href={routes.program}>
                See the full curriculum
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </SectionHeader>

          <RevealGroup as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {programModules.map((module) => {
              return (
                <RevealItem
                  as="li"
                  key={module.id}
                  className="group relative rounded-2xl border bg-card p-6 transition-colors hover:border-primary/30"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon name={module.icon} className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-base leading-snug font-semibold">
                    <Link
                      href={`${routes.program}#${module.slug}`}
                      className="before:absolute before:inset-0"
                    >
                      {module.title}
                    </Link>
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {module.summary}
                  </p>
                  <ul className="mt-4 grid gap-1.5 text-xs leading-relaxed text-muted-foreground">
                    {getModuleSchedules(module.slug).map((schedule) => (
                      <li key={schedule.level}>
                        {schedule.level}: {formatProgramDuration(schedule.durationMinutes)}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Activities ──────────────────────────────────────────────────── */}
      <Section tone="contrast" className="overflow-hidden">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-end">
            <Reveal>
              <p className="font-mono text-xs tracking-[0.18em] text-gold-300 uppercase">
                What students actually do
              </p>
              <h2 className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl">
                Nobody remembers a slide.
                <br />
                Everybody remembers the wing they built.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-navy-200">
                School-based sessions include wing-building, route-planning and airport-operation
                activities. After the modules, we organise a separately quoted field trip to an
                aviation facility with simulators. Simulator activities take place at the host
                facility.
              </p>
              <Button asChild size="lg" variant="accent" className="mt-8">
                <Link href={routes.activities}>
                  Browse every activity
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>

            <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2">
              {activities.slice(0, 4).map((activity) => {
                return (
                  <RevealItem
                    as="li"
                    key={activity.slug}
                    className="relative rounded-2xl border border-white/12 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/10"
                  >
                    <Icon name={activity.icon} className="size-6 text-gold-300" aria-hidden />
                    <h3 className="mt-4 font-display text-base font-semibold">
                      <Link
                        href={`${routes.activities}#${activity.slug}`}
                        className="before:absolute before:inset-0"
                      >
                        {activity.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-200">{activity.tagline}</p>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ── Careers ─────────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="Fourteen pathways"
            title="Every career mapped from school subject to first salary."
            description="Not inspiration — instructions. Each pathway states the subjects, the grades, the licence, the institution and the realistic pay."
          >
            <Button asChild variant="outline" size="lg">
              <Link href={routes.careers}>
                See all fourteen careers
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </SectionHeader>

          <RevealGroup as="ul" className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCareers.map((career) => (
              <RevealItem as="li" key={career.slug}>
                <CareerCard career={career} className="h-full" />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Why it matters ──────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="Why this matters"
            title="Four reasons this is worth doing properly."
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
        </div>
      </Section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      {testimonials.items.length > 0 ? (
        <Section>
          <div className="container-page">
            <SectionHeader
              eyebrow="In their words"
              title="Head teachers, students, parents and the volunteers who deliver it."
            />
            <div className="mt-14">
              <TestimonialCarousel testimonials={testimonials.items} />
            </div>
          </div>
        </Section>
      ) : null}

      {/* ── Events ──────────────────────────────────────────────────────── */}
      {upcomingEvents.items.length > 0 ? (
        <Section tone="surface">
          <div className="container-page">
            <SectionHeader
              eyebrow="Coming up"
              title="Open days, airport tours and career fairs."
              description="Get Quotation for your group. Attendance is subject to availability and booking confirmation."
            >
              <Button asChild variant="outline" size="lg">
                <Link href={routes.events}>
                  All events
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </SectionHeader>

            <RevealGroup as="ul" className="mt-14 grid gap-5">
              {upcomingEvents.items.map((event) => (
                <RevealItem as="li" key={event.id}>
                  <EventCard event={event} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      {/* ── Partners ────────────────────────────────────────────────────── */}
      {partners.items.length > 0 ? (
        <Section size="sm">
          <div className="container-page">
            <Reveal className="text-center">
              <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Working with
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              <PartnerStrip partners={partners.items} />
            </Reveal>
            <Reveal delay={0.12} className="mt-8 text-center">
              <Button asChild variant="ghost">
                <Link href={routes.partners}>
                  Partner with us
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </Section>
      ) : null}

      {/* ── Latest writing ──────────────────────────────────────────────── */}
      {articles.items.length > 0 ? (
        <Section tone="surface">
          <div className="container-page">
            <SectionHeader
              eyebrow="Field notes"
              title="What we are learning, written down."
              description="Research from the classroom, honest career guidance, and student stories."
            >
              <Button asChild variant="outline" size="lg">
                <Link href={routes.news}>
                  Read everything
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </SectionHeader>

            <RevealGroup as="ul" className="mt-14 grid gap-6 md:grid-cols-3">
              {articles.items.map((article) => (
                <RevealItem as="li" key={article.id}>
                  <ArticleCard article={article} className="h-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      {/* ── Closing CTA ─────────────────────────────────────────────────── */}
      <Section size="sm">
        <CtaBand
          eyebrow="Get Quotation"
          title="Your students are one afternoon away from a career they have never heard of."
          description="Tell us your school’s location, learner numbers and preferred modules. We will prepare a quotation for school-based teaching and a separately costed field trip after the modules."
          primary={{ label: "Get Quotation", href: routes.quotation }}
          secondary={{ label: "Talk to us first", href: routes.contact }}
        />
      </Section>

      <div className="container-page pb-4">
        <Reveal className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="muted">Services quoted individually</Badge>
          <Badge variant="muted">Anywhere in Kenya</Badge>
          <Badge variant="muted">CBC-aligned</Badge>
          <Badge variant="muted">Delivered by working professionals</Badge>
        </Reveal>
      </div>
    </>
  );
}
