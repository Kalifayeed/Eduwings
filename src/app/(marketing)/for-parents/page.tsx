import Link from "next/link";
import { ArrowRight, GraduationCap, HeartHandshake, Route } from "lucide-react";

import { routes } from "@/config/routes";
import { faqs } from "@/lib/content/editorial";
import { getFeaturedCareers } from "@/lib/content/careers";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { CareerCard } from "@/components/cards/career-card";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "For Parents", href: routes.parents },
];

const PARENT_FAQS = faqs.filter((faq) => faq.audience === "Parents");

export const metadata = buildMetadata({
  title: "For Parents",
  description:
    "What aviation careers your child can pursue, which subjects matter, and honest answers on cost and stability — aviation career guidance for Kenyan parents.",
  path: routes.parents,
});

const WHAT_WE_DO = [
  {
    icon: GraduationCap,
    title: "We widen the list, not just the pilot's seat",
    body: "Fourteen documented aviation careers, each with the real subjects, grades and licences it needs — so your child chooses from options they actually know exist.",
  },
  {
    icon: Route,
    title: "We make ambition concrete",
    body: "Every career page states the exact pathway from school subject to first salary, so 'I want to work in aviation' becomes a specific, actionable next step.",
  },
  {
    icon: HeartHandshake,
    title: "We put a face to the career",
    body: "Sessions are delivered by working aviation professionals, and school visits to real airports and colleges — not just slides — are part of the programme.",
  },
];

export default function ForParentsPage() {
  const featuredCareers = getFeaturedCareers(6);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(BREADCRUMBS),
          faqSchema(PARENT_FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }))),
        )}
      />

      <PageHero
        eyebrow="For parents"
        title="Aviation career guidance, for families who don't work in aviation."
        description="Most parents can name two aviation careers: pilot and cabin crew. There are at least fourteen, each with a real pathway. This page is the honest version — what it costs, how long it takes, and what to do this term."
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── What EduWings actually does ─────────────────────────────────── */}
      <Section size="sm">
        <div className="container-page">
          <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-3">
            {WHAT_WE_DO.map((item) => (
              <RevealItem as="li" key={item.title} className="rounded-2xl border bg-card p-6">
                <item.icon aria-hidden className="size-6 text-primary" />
                <h2 className="mt-4 font-display text-base font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Honest answers ───────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="Questions parents ask us first"
            title="The honest answer on cost, stability and what your child needs."
            align="center"
          />

          <Reveal className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="rounded-2xl border bg-card px-6">
              {PARENT_FAQS.map((faq, index) => (
                <AccordionItem key={faq.question} value={`parent-faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Section>

      {/* ── Career pathways at a glance ──────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="Career pathways at a glance"
            title="A starting point — the full pathway is on every career page."
            description="Subjects, entry requirements and indicative salary bands, mapped end to end."
          />

          <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCareers.map((career) => (
              <RevealItem as="li" key={career.slug}>
                <CareerCard career={career} />
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-10 flex justify-center">
            <Link
              href={routes.careers}
              className="inline-flex items-center gap-1.5 font-medium text-primary underline underline-offset-4"
            >
              See all fourteen careers
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          title="Ask your child’s school to request a quotation."
          description="Ask your school to Get Quotation for aviation modules, career guidance and an organised field trip after the modules."
          primary={{ label: "Get Quotation", href: routes.quotation }}
          secondary={{ label: "Explore all careers", href: routes.careers }}
        />
      </Section>
    </>
  );
}
