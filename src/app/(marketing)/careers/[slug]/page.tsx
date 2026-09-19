import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Info, TrendingUp } from "lucide-react";

import { routes } from "@/config/routes";
import { careers, disciplineLabel, getCareer, getCareersByDiscipline } from "@/lib/content/careers";
import { getInstitutionsForCareer } from "@/lib/content/institutions";
import { Icon } from "@/components/icon";
import { formatCurrency } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph, occupationSchema } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarkdownContent } from "@/components/content/markdown";
import { AppImage } from "@/components/media/app-image";
import { CareerCard } from "@/components/cards/career-card";
import { InstitutionCard } from "@/components/cards/institution-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Every career is known at build time, so all fourteen pages are prerendered. */
export function generateStaticParams() {
  return careers.map((career) => ({ slug: career.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const career = getCareer(slug);

  if (!career) {
    return buildMetadata({
      title: "Career not found",
      description: "This aviation career page could not be found.",
      path: routes.career(slug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${career.title} — Aviation Career Pathway`,
    description: `${career.summary} Subjects, grades, training route and realistic salary for becoming a ${career.title.toLowerCase()} in Kenya.`,
    path: routes.career(career.slug),
    keywords: [
      `how to become a ${career.title.toLowerCase()} in Kenya`,
      `${career.title} salary Kenya`,
      `${career.title} requirements`,
      ...career.subjects,
    ],
  });
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const career = getCareer(slug);

  if (!career) notFound();
  const related = getCareersByDiscipline(career.discipline)
    .filter((item) => item.slug !== career.slug)
    .slice(0, 3);
  const trainingInstitutions = getInstitutionsForCareer(career.slug);

  const breadcrumbs = [
    { label: "Home", href: routes.home },
    { label: "Careers", href: routes.careers },
    { label: career.title, href: routes.career(career.slug) },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(breadcrumbs),
          occupationSchema({
            title: career.title,
            description: career.summary,
            path: routes.career(career.slug),
            salaryMin: career.salary?.entry ?? null,
            salaryMax: career.salary?.experienced ?? null,
          }),
        )}
      />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b bg-aurora">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        <div className="relative container-page pt-10 pb-16">
          <Breadcrumb items={breadcrumbs} className="mb-8" />

          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <Icon name={career.icon} className="size-6" aria-hidden />
                </span>
                <Badge variant="secondary">{disciplineLabel(career.discipline)}</Badge>
              </div>

              <h1 className="mt-7 font-display text-4xl leading-[1.06] font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {career.title}
              </h1>

              <p className="mt-6 text-lg leading-relaxed font-medium text-balance text-primary">
                {career.hook}
              </p>

              <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                {career.summary}
              </p>

              {career.salary ? (
                <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
                  <div>
                    <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                      Entry level
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-bold">
                      {formatCurrency(career.salary.entry)}
                      <span className="text-sm font-normal text-muted-foreground"> / month</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                      Experienced
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-bold text-primary">
                      {formatCurrency(career.salary.experienced)}
                      <span className="text-sm font-normal text-muted-foreground"> / month</span>
                    </dd>
                  </div>
                </dl>
              ) : null}
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[var(--shadow-float)]">
                <AppImage
                  src={null}
                  alt={`Illustration representing a career as ${career.title}`}
                  seed={career.slug}
                  motif={career.motif}
                  priority
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  className="size-full"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight">What the job is</h2>
              <MarkdownContent content={career.overview} className="mt-6" />
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-display text-2xl font-bold tracking-tight">A day in the life</h2>
              <ol className="mt-6 grid gap-4">
                {career.dayInTheLife.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary font-display text-sm font-semibold text-secondary-foreground">
                      {index + 1}
                    </span>
                    <p className="pt-1 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                The pathway, step by step
              </h2>
              <ol className="relative mt-8">
                <span
                  aria-hidden
                  className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-primary/50 via-primary/25 to-transparent"
                />
                {career.pathway.map((step) => (
                  <li key={step.stage} className="relative pb-8 pl-10 last:pb-0">
                    <span
                      aria-hidden
                      className="absolute top-1.5 left-0 size-4 rounded-full border-4 border-background bg-primary"
                    />
                    <h3 className="font-display text-base font-semibold">{step.stage}</h3>
                    <p className="mt-1.5 leading-relaxed text-muted-foreground">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-display text-2xl font-bold tracking-tight">Career growth</h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">{career.growth}</p>

              <div className="mt-8 flex gap-4 rounded-2xl border bg-card p-6">
                <TrendingUp aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold">Honest outlook</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {career.outlook}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Reveal className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-base font-semibold">School subjects that matter</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {career.subjects.map((subject) => (
                  <li key={subject}>
                    <Badge variant="default">
                      <BookOpen className="size-3.5" aria-hidden />
                      {subject}
                    </Badge>
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 font-display text-base font-semibold">Skills you will need</h2>
              <ul className="mt-4 grid gap-2.5">
                {career.skills.map((skill) => (
                  <li key={skill} className="flex gap-2.5 text-sm leading-relaxed">
                    <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>

              {career.salary?.note ? (
                <Alert variant="info" className="mt-8">
                  <Info aria-hidden />
                  <AlertDescription>{career.salary.note}</AlertDescription>
                </Alert>
              ) : null}

              <Button asChild className="mt-8 w-full" size="lg">
                <Link href={routes.schools}>
                  Bring this to your school
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>
          </aside>
        </div>
      </Section>

      {/* ── Where to train ──────────────────────────────────────────────── */}
      {trainingInstitutions.length > 0 ? (
        <Section tone="surface">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Where to train in Kenya
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              Institutions cross-checked against KCAA&apos;s own approved training organisations
              list.
            </p>

            <RevealGroup as="ul" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trainingInstitutions.map((institution) => (
                <RevealItem as="li" key={institution.slug}>
                  <InstitutionCard institution={institution} className="h-full" />
                </RevealItem>
              ))}
            </RevealGroup>

            <div className="mt-10">
              <Button asChild variant="outline" size="lg">
                <Link href={routes.courses}>
                  See all institutions
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      ) : null}

      {/* ── Related careers ─────────────────────────────────────────────── */}
      {related.length > 0 ? (
        <Section tone="surface">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Others in {disciplineLabel(career.discipline)}
            </h2>

            <RevealGroup as="ul" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RevealItem as="li" key={item.slug}>
                  <CareerCard career={item} className="h-full" />
                </RevealItem>
              ))}
            </RevealGroup>

            <div className="mt-10">
              <Button asChild variant="outline" size="lg">
                <Link href={routes.careers}>
                  See all fourteen careers
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      ) : null}

      <Section size="sm">
        <CtaBand
          title={`Know a student who should read this?`}
          description="We deliver these pathways in person, with someone who does the job standing at the front of the room."
          primary={{ label: "Get Quotation", href: routes.quotation }}
          secondary={{ label: "Talk to us", href: routes.contact }}
        />
      </Section>
    </>
  );
}
