import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Phone, ShieldCheck } from "lucide-react";

import { routes } from "@/config/routes";
import { getCareer } from "@/lib/content/careers";
import { institutions, getInstitution } from "@/lib/content/institutions";
import { Icon } from "@/components/icon";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { AppImage } from "@/components/media/app-image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** All verified institutions are known at build time. */
export function generateStaticParams() {
  return institutions.map((institution) => ({ slug: institution.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const institution = getInstitution(slug);

  if (!institution) {
    return buildMetadata({
      title: "Institution not found",
      description: "This institution page could not be found.",
      path: routes.course(slug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${institution.name} — Aviation Courses in Kenya`,
    description: institution.summary,
    path: routes.course(institution.slug),
    keywords: [institution.name, "aviation courses in Kenya", ...institution.courses.map((c) => c.qualification)],
  });
}

export default async function InstitutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const institution = getInstitution(slug);

  if (!institution) notFound();

  const breadcrumbs = [
    { label: "Home", href: routes.home },
    { label: "Where to Train", href: routes.courses },
    { label: institution.name, href: routes.course(institution.slug) },
  ];

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(breadcrumbs))} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b bg-aurora">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        <div className="relative container-page pt-10 pb-16">
          <Breadcrumb items={breadcrumbs} className="mb-8" />

          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <Icon name={institution.icon} className="size-6" aria-hidden />
                </span>
                <Badge variant="secondary">{institution.type}</Badge>
                {institution.kcaaApproved ? (
                  <Badge variant="outline" className="border-success text-success">
                    <ShieldCheck className="size-3.5" aria-hidden />
                    KCAA-approved
                  </Badge>
                ) : null}
              </div>

              <h1 className="mt-7 font-display text-4xl leading-[1.06] font-bold tracking-tight sm:text-5xl">
                {institution.name}
              </h1>

              <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                {institution.summary}
              </p>

              <p className="mt-5 text-sm text-muted-foreground">{institution.location.town}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {institution.website ? (
                  <Button asChild variant="outline">
                    <a href={institution.website} target="_blank" rel="noopener noreferrer">
                      Visit official site
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                ) : null}
                {institution.contactPhone ? (
                  <Button asChild variant="outline">
                    <a href={`tel:${institution.contactPhone.replace(/\s+/g, "")}`}>
                      <Phone className="size-4" />
                      {institution.contactPhone}
                    </a>
                  </Button>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[var(--shadow-float)]">
                <AppImage
                  src={null}
                  alt=""
                  seed={institution.slug}
                  motif={institution.motif}
                  priority
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  className="size-full"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── Courses ─────────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Courses offered here
          </h2>

          <div className="mt-10 grid gap-6">
            {institution.courses.map((course) => {
              const relatedCareers = course.careerSlugs
                .map((s) => getCareer(s))
                .filter((c) => c !== undefined);

              return (
                <Reveal
                  key={course.title}
                  className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold">{course.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{course.qualification}</p>
                    </div>
                    <Badge variant="secondary">{course.durationText}</Badge>
                  </div>

                  <h4 className="mt-6 font-mono text-xs tracking-[0.18em] text-primary uppercase">
                    Entry requirements
                  </h4>
                  <ul className="mt-3 grid gap-2">
                    {course.entryRequirements.map((requirement) => (
                      <li key={requirement} className="text-sm leading-relaxed text-muted-foreground">
                        · {requirement}
                      </li>
                    ))}
                  </ul>

                  {relatedCareers.length > 0 ? (
                    <div className="mt-6 flex flex-wrap items-center gap-2 border-t pt-5">
                      <span className="text-xs text-muted-foreground">Trains toward:</span>
                      {relatedCareers.map((career) => (
                        <Link key={career.slug} href={routes.career(career.slug)}>
                          <Badge variant="default">{career.title}</Badge>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </Reveal>
              );
            })}
          </div>

          <Alert variant="info" className="mt-10">
            <AlertDescription>
              <span className="font-medium text-foreground">Source: </span>
              {institution.sourceNote}
            </AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          title="Want your students to see this in person?"
          description="We can help arrange a visit, or match your group to the right destination if you are not sure where to start."
          primary={{ label: "Plan an aviation visit", href: routes.visit }}
          secondary={{ label: "See all institutions", href: routes.courses }}
        />
      </Section>

      <div className="container-page pb-16 text-center">
        <Link
          href={routes.courses}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-4"
        >
          See all institutions
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </>
  );
}
