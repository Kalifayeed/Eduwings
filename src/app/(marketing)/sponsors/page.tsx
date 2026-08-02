import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Megaphone } from "lucide-react";

import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { formatCurrency } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { PartnerDirectory } from "@/components/marketing/partner-directory";
import { CtaBand } from "@/components/marketing/cta-band";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Sponsors", href: routes.sponsors },
];

export const metadata = buildMetadata({
  title: "Sponsors",
  description:
    "Organisations funding EduWings school visits across Kenya. See what sponsorship buys, what sponsors receive in return, and how to get involved.",
  path: routes.sponsors,
});

const SPONSOR_PACKAGES = [
  {
    amount: 180000,
    title: "County Programme",
    body: "Four school visits in one county, prioritising schools with no prior exposure to the aviation industry.",
    includes: [
      "Four full-day visits, up to 1,200 students",
      "Named acknowledgement at each visit",
      "A written impact report per school",
      "Photography you may use",
    ],
  },
  {
    amount: 540000,
    title: "Regional Programme",
    body: "A full term across three counties, including the travel and logistics that make upcountry visits possible at all.",
    includes: [
      "Twelve visits, up to 3,600 students",
      "Logo placement on programme materials",
      "A consolidated termly impact report",
      "An invitation to attend a visit in person",
    ],
  },
  {
    amount: 1_200_000,
    title: "National Partner",
    body: "A year of programme delivery, including the equipment renewal and volunteer coordination that nobody else funds.",
    includes: [
      "A full year of school visits nationwide",
      "Named partnership across the programme",
      "Quarterly reporting and an annual review",
      "Co-branded career materials for schools",
    ],
  },
] as const;

const WHAT_SPONSORS_GET = [
  {
    icon: FileText,
    title: "Reporting you can actually use",
    body: "School names, student numbers, and the before-and-after career recall figures. Real data, not a photo collage.",
  },
  {
    icon: BarChart3,
    title: "Measurable outcomes",
    body: "We survey students before and after every visit. You receive those figures for the schools you funded, including where the shift was small.",
  },
  {
    icon: Megaphone,
    title: "Honest recognition",
    body: "Named acknowledgement at visits and on programme materials. We will not overstate your involvement, which is what makes the acknowledgement worth having.",
  },
];

export default async function SponsorsPage() {
  const { items: sponsors } = await getContentSource().partners.list({ kind: "sponsor" });

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Sponsors"
        title="Every free school visit is free because somebody paid for it."
        description="EduWings costs schools nothing. That is a deliberate choice, and it only holds because these organisations fund the work. Here is what sponsorship buys and what sponsors get back."
        breadcrumbs={BREADCRUMBS}
        actions={
          <Button asChild size="lg">
            <Link href={`${routes.partners}#partner-with-us`}>
              Become a sponsor
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <Section>
        <div className="container-page">
          <PartnerDirectory
            partners={sponsors}
            emptyAction={{ label: "Talk to us about sponsorship", href: routes.partners }}
          />
        </div>
      </Section>

      {/* ── Packages ────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="Sponsorship"
            title="Three levels, priced against what they actually deliver."
            description="These are the real costs of running the programme, not a rate card. Smaller and larger arrangements are both welcome."
          />

          <RevealGroup as="ul" className="mt-14 grid gap-6 lg:grid-cols-3">
            {SPONSOR_PACKAGES.map((pkg, index) => (
              <RevealItem
                as="li"
                key={pkg.title}
                className={
                  index === 1
                    ? "relative flex flex-col rounded-2xl border-2 border-primary bg-card p-7 shadow-[var(--shadow-lift)]"
                    : "flex flex-col rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
                }
              >
                {index === 1 ? (
                  <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most impact per shilling
                  </span>
                ) : null}

                <h3 className="font-display text-lg font-semibold">{pkg.title}</h3>
                <p className="mt-3 font-display text-3xl font-bold tracking-tight text-primary">
                  {formatCurrency(pkg.amount)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{pkg.body}</p>

                <ul className="mt-6 grid flex-1 gap-2.5 border-t pt-6">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── What sponsors receive ───────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader eyebrow="In return" title="What we owe a sponsor." align="center" />

          <RevealGroup as="ul" className="mt-14 grid gap-6 md:grid-cols-3">
            {WHAT_SPONSORS_GET.map((item) => (
              <RevealItem
                as="li"
                key={item.title}
                className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-accent/15 text-gold-700 dark:text-gold-300">
                  <item.icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-lg leading-snug font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mx-auto mt-14 max-w-2xl text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              We will not claim your sponsorship achieved something it did not. If a visit goes
              badly or the numbers are weak, that appears in your report too. It is the only way the
              good reports mean anything.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          eyebrow="Sponsorship"
          title="Fund the schools that nobody else reaches."
          description="The visits that matter most are the ones furthest from an airport — and the hardest to pay for. That is where sponsorship goes first."
          primary={{ label: "Become a sponsor", href: `${routes.partners}#partner-with-us` }}
          secondary={{ label: "Make a one-off gift", href: routes.donate }}
        />
      </Section>
    </>
  );
}
