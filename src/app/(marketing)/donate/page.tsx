import { Banknote, HeartHandshake, Receipt, ShieldCheck } from "lucide-react";

import { routes } from "@/config/routes";
import { formatCurrency } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { DonationForm } from "@/components/forms/donation-form";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Donate", href: routes.donate },
];

export const metadata = buildMetadata({
  title: "Donate",
  description:
    "Support access to aviation learning by contributing towards a school’s quoted programme, teaching materials or organised field trip.",
  path: routes.donate,
});

/** What money buys, stated in units a donor can picture. */
const IMPACT_TIERS = [
  {
    amount: 2500,
    title: "Towards teaching materials",
    body: "A contribution towards learning materials, charts and career resources for an agreed school programme.",
  },
  {
    amount: 12000,
    title: "Towards a simulator facility visit",
    body: "A contribution towards the organised field trip after the modules. Simulator activities take place at the host facility, with access and charges confirmed in advance.",
  },
  {
    amount: 45000,
    title: "Towards a school programme",
    body: "A contribution towards a school’s individually quoted teaching programme. The learner numbers, modules and delivery dates are agreed before support is allocated.",
  },
  {
    amount: 180000,
    title: "Towards regional access",
    body: "A contribution towards agreed teaching, travel and field-trip costs for schools beyond Nairobi. The final scope follows a programme quotation.",
  },
] as const;

const ASSURANCES = [
  {
    icon: Banknote,
    title: "Support for agreed programme costs",
    body: "We agree how your contribution will support teaching, materials, travel or facility visits.",
  },
  {
    icon: Receipt,
    title: "A receipt for everything",
    body: "Issued as soon as the gift clears, whether it arrives by M-Pesa or bank transfer.",
  },
  {
    icon: ShieldCheck,
    title: "No card details on this site",
    body: "We collect your intention here and send payment instructions separately. Nothing sensitive passes through this form.",
  },
  {
    icon: HeartHandshake,
    title: "We tell you what happened",
    body: "After the visit your gift funds, we write to you with the school, the numbers and what students said.",
  },
];

export default function DonatePage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Donate"
        title="Help more learners discover aviation."
        description="EduWings services are individually quoted. Donations contribute towards agreed programme or field-trip costs for selected schools. We confirm the funded activities before allocating support."
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── What it buys ────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="What your gift funds"
            title="Choose how you would like to contribute."
            description="These are suggested donation amounts, not service prices or guarantees of a complete programme. We confirm the funded activities and learner numbers with you."
          />

          <RevealGroup as="ul" className="mt-14 grid gap-6 sm:grid-cols-2">
            {IMPACT_TIERS.map((tier) => (
              <RevealItem
                as="li"
                key={tier.amount}
                className="flex flex-col rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
              >
                <p className="font-display text-3xl font-bold tracking-tight text-primary">
                  {formatCurrency(tier.amount)}
                </p>
                <h3 className="mt-3 font-display text-lg leading-snug font-semibold">
                  {tier.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tier.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <Reveal className="rounded-3xl border bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight">Make a gift</h2>
            <p className="mt-2.5 leading-relaxed text-muted-foreground">
              Choose an amount, tell us where to send instructions, and we will handle the rest.
            </p>
            <DonationForm className="mt-8" />
          </Reveal>

          <div>
            <SectionHeader eyebrow="How we handle it" title="Four things we commit to." />

            <RevealGroup as="ul" className="mt-10 grid gap-6">
              {ASSURANCES.map((item) => (
                <RevealItem as="li" key={item.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ── Alternatives ────────────────────────────────────────────────── */}
      <Section size="sm">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Money is not the only thing we need.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If you work in aviation, a few days of your time is worth more to a classroom than
              most cheques. And if your organisation can open a hangar, a tower or an operations
              centre to students, that is worth more still.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={routes.volunteer}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40"
              >
                Volunteer instead
              </a>
              <a
                href={routes.partners}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40"
              >
                Partner with us
              </a>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
