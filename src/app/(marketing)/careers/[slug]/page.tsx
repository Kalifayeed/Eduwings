import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import { routes } from "@/config/routes";
import {
  careers,
  CAREER_REVIEWED_ON,
  disciplineLabel,
  getCareer,
  getCareersByDiscipline,
} from "@/lib/content/careers";
import { getCareerPhoto } from "@/lib/content/career-photos";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph, occupationSchema } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarkdownContent } from "@/components/content/markdown";
import { AppImage } from "@/components/media/app-image";
import { CareerCard } from "@/components/cards/career-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}
export function generateStaticParams() {
  return careers.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const career = getCareer(slug);
  return buildMetadata({
    title: career ? career.title + " — Courses & Career Catalogue" : "Career not found",
    description: career
      ? career.summary +
        " Kenyan study routes, entry requirements, qualifications and career opportunities. EduWings provides awareness and guidance."
      : "This career could not be found.",
    path: routes.career(slug),
    noIndex: !career,
  });
}
export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const career = getCareer(slug);
  if (!career) notFound();
  const photo = getCareerPhoto(slug);
  const related = getCareersByDiscipline(career.discipline)
    .filter((item) => item.slug !== slug)
    .slice(0, 3);
  const breadcrumbs = [
    { label: "Home", href: routes.home },
    { label: "Courses & careers", href: routes.careers },
    { label: career.title, href: routes.career(slug) },
  ];
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(breadcrumbs),
          occupationSchema({
            title: career.title,
            description: career.summary,
            path: routes.career(slug),
          }),
        )}
      />
      <div className="relative overflow-hidden border-b bg-aurora">
        <div className="container-page pt-10 pb-16">
          <Breadcrumb items={breadcrumbs} className="mb-8" />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <Reveal>
              <Badge variant="secondary">{disciplineLabel(career.discipline)}</Badge>
              <p className="mt-6 font-mono text-xs tracking-widest text-primary uppercase">
                Courses &amp; career catalogue
              </p>
              <h1 className="mt-4 font-display text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
                {career.title}
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-primary">{career.hook}</p>
              <p className="mt-5 leading-relaxed text-muted-foreground">{career.summary}</p>
              <p className="mt-5 rounded-xl border bg-card p-4 text-sm leading-relaxed">
                EduWings offers aviation awareness training and career guidance for school learners.
                The professional courses below are delivered by independent institutions; EduWings
                does not offer or award these qualifications.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link href={routes.career(slug) + "#training"}>
                  Explore study routes <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>
            <Reveal delay={0.1}>
              <figure>
                <AppImage
                  src={photo.src}
                  alt={photo.alt}
                  seed={slug}
                  priority
                  quality={90}
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="aspect-[4/3] rounded-3xl shadow-[var(--shadow-float)]"
                />
                <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Illustrative stock photography.{" "}
                  <Link href={routes.photoCredits + "#" + slug} className="underline">
                    Photo credit and licence
                  </Link>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
      <Section>
        <div className="container-page grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
          <div className="min-w-0 space-y-14">
            <section aria-labelledby="about-career">
              <h2 id="about-career" className="font-display text-2xl font-bold">
                What this career is about
              </h2>
              <MarkdownContent content={career.overview} className="mt-5" />
            </section>
            <section aria-labelledby="learning">
              <h2 id="learning" className="font-display text-2xl font-bold">
                What you will study
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Typical learning areas across these routes; the institution’s syllabus defines the
                exact content.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {career.studyTopics.map((topic) => (
                  <li key={topic} className="flex gap-3 rounded-xl border bg-card p-4">
                    <BookOpen className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-sm leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section id="training" aria-labelledby="study-routes" className="scroll-mt-28">
              <h2 id="study-routes" className="font-display text-2xl font-bold">
                Courses and study routes in Kenya
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Examples of relevant routes, with institution-specific entry guidance. Contact the
                provider to confirm the current intake and assess your qualifications.
              </p>
              <div className="mt-6 grid gap-6">
                {career.trainingRoutes.map((course) => (
                  <article key={course.title} className="rounded-2xl border bg-card p-6 sm:p-7">
                    <p className="text-sm font-medium text-primary">{course.institution}</p>
                    <h3 className="mt-2 font-display text-xl font-semibold">{course.title}</h3>
                    <h4 className="mt-6 font-semibold">Entry requirements</h4>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                      {course.entryRequirements.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                    <dl className="mt-6 space-y-4 text-sm leading-relaxed">
                      <div>
                        <dt className="font-semibold">Qualification and progression</dt>
                        <dd className="mt-1 text-muted-foreground">{course.qualification}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Study duration</dt>
                        <dd className="mt-1 text-muted-foreground">{course.duration}</dd>
                      </div>
                    </dl>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary underline"
                    >
                      Explore the institution’s course information{" "}
                      <ExternalLink className="size-4" aria-hidden />
                    </a>
                  </article>
                ))}
              </div>
            </section>
            <section aria-labelledby="qualifications">
              <h2 id="qualifications" className="font-display text-2xl font-bold">
                Professional requirements and qualifications
              </h2>
              <ul className="mt-6 space-y-4">
                {career.requirements.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
                    <p className="leading-relaxed text-muted-foreground">{item}</p>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="opportunities">
              <h2 id="opportunities" className="font-display text-2xl font-bold">
                Career opportunities
              </h2>
              <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
                {career.opportunities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-muted-foreground">{career.growth}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                These are possible pathways, not promises of employment. Employers assess
                qualifications, competence and experience.
              </p>
            </section>
            <section aria-labelledby="sources" className="rounded-2xl border bg-surface p-6">
              <h2 id="sources" className="font-display text-xl font-semibold">
                Official sources and further reading
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Reviewed {CAREER_REVIEWED_ON}. Requirements and intake availability can change;
                confirm with the named institution and regulator before applying.
              </p>
              <ul className="mt-4 space-y-3">
                {career.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border bg-card p-7">
              <h2 className="font-display text-lg font-semibold">School subjects to build on</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {career.subjects.map((subject) => (
                  <li key={subject}>
                    <Badge variant="secondary">{subject}</Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                These are useful preparation subjects. Formal entry grades appear under each study
                route.
              </p>
              <h2 className="mt-8 font-display text-lg font-semibold">Skills to develop</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {career.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              <h2 className="mt-8 font-display text-lg font-semibold">Start exploring at school</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                EduWings helps learners understand their options through awareness modules,
                mentorship and guided facility visits.
              </p>
              <Button asChild className="mt-5 w-full">
                <Link href={routes.quotation}>
                  Arrange school guidance <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>
      {related.length ? (
        <Section tone="surface">
          <div className="container-page">
            <h2 className="font-display text-3xl font-bold">Explore related careers</h2>
            <RevealGroup as="ul" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RevealItem as="li" key={item.slug}>
                  <CareerCard career={item} className="h-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}
      <Section size="sm">
        <CtaBand
          title="Help your students understand their aviation options."
          description="EduWings delivers awareness and career guidance at school. Professional qualifications are pursued with the relevant training institution."
          primary={{ label: "Explore our awareness programme", href: routes.program }}
          secondary={{ label: "All courses & careers", href: routes.careers }}
        />
      </Section>
    </>
  );
}
