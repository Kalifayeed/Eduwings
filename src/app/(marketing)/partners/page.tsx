import { Building2, DoorOpen, Users } from "lucide-react";

import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { PartnerDirectory } from "@/components/marketing/partner-directory";
import { PartnershipForm } from "@/components/forms/partnership-form";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Partners", href: routes.partners },
];

export const metadata = buildMetadata({
  title: "Partners",
  description:
    "The airlines, airports, regulators and training institutions that open their doors, release their staff and verify our career pathways.",
  path: routes.partners,
});

const WAYS_TO_HELP = [
  {
    icon: DoorOpen,
    title: "Open your facility",
    body: "Help learners experience a hangar, control tower or operations centre. We agree access, supervision, scheduling and any host charges before arranging a field trip.",
  },
  {
    icon: Users,
    title: "Release your staff",
    body: "Two to four days a year from a pilot, engineer or controller. This is the contribution that changes the most and the one most organisations underestimate.",
  },
  {
    icon: Building2,
    title: "Verify what we publish",
    body: "Our career pathways state real entry requirements, real licences and real salary bands. Institutions and regulators who check them keep this site accurate.",
  },
];

export default async function PartnersPage() {
  const { items: partners } = await getContentSource().partners.list({ kind: "partner" });

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Partners"
        title="Organisations that open doors we could never open alone."
        description="EduWings can write about a control tower. Only a partner can put a student inside one. These are the organisations that make the difference between a description and an experience."
        breadcrumbs={BREADCRUMBS}
      />

      <Section>
        <div className="container-page">
          <PartnerDirectory
            partners={partners}
            emptyAction={{ label: "Talk to us about partnering", href: "#partner-with-us" }}
          />
        </div>
      </Section>

      {/* ── Ways to help ────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="How organisations help"
            title="Three ways, and the cheapest one matters most."
            align="center"
          />

          <RevealGroup as="ul" className="mt-14 grid gap-6 md:grid-cols-3">
            {WAYS_TO_HELP.map((item) => (
              <RevealItem
                as="li"
                key={item.title}
                className="rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-lg leading-snug font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeader
              eyebrow="Partner with us"
              title="Tell us what you can realistically offer."
              description="We would rather agree something small and actually do it than sign a memorandum that produces nothing. Be specific and we will come back with a concrete proposal within three working days."
            />
          </div>

          <Reveal
            id="partner-with-us"
            className="scroll-mt-32 rounded-3xl border bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10"
          >
            <PartnershipForm />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
