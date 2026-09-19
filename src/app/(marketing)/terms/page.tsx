import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { MarkdownContent } from "@/components/content/markdown";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: `The terms governing use of the ${siteConfig.name} website and participation in the programme.`,
  path: routes.terms,
});

const LAST_UPDATED = "19 September 2026";

const TERMS = `
## Using this site

This website is operated by ${siteConfig.legalName}. By using it you accept these terms. If you do not, please do not use the site.

## Careers, salaries and training information

This is the section that matters most, so it comes first.

The career catalogues describe study routes, entry requirements, qualifications and career opportunities. They link to institutional and regulatory sources. EduWings provides school awareness and guidance, not the professional courses or qualifications described in the catalogues.

They are nonetheless **guidance, not advice, and not an offer**:

- **Entry requirements change.** Institutions revise their grade requirements and the Kenya Civil Aviation Authority revises licensing rules. Always confirm current requirements directly with the institution or the regulator before making a decision.
- **We cannot guarantee outcomes.** Completing a pathway described here does not guarantee employment. Aviation is cyclical, and several of these careers are genuinely competitive. We say so on the pages themselves.

Before committing money or years to a training route, verify the specifics with the training organisation and the regulator. If something on this site is out of date, please tell us — we will correct it.

## The programme

Services are provided on an individual quotation basis. Your quotation sets out the agreed modules, learner numbers, teaching schedule, fees and inclusions. Submitting an enquiry does not confirm a booking.

School-based modules use teaching materials and classroom activities. After the modules, EduWings organises a separately quoted field trip to an aviation facility with simulators. Simulator demonstrations or hands-on sessions take place at the host facility and depend on its availability, age requirements, capacity and operating conditions.

Transport, facility access, simulator activities, meals and any other costs are included only where expressly listed in the quotation. Dates and arrangements are confirmed with the school and host facility before the visit.

We reserve the right to reschedule a visit where travel, weather, facilitator or host-facility availability, or safety require it. We will give as much notice as we can.

Schools remain responsible for supervision of their students throughout a visit. Our facilitators deliver sessions; they do not assume duty of care for students.

## Photography and media

We photograph and occasionally film sessions, and we seek the school's permission before publishing any image in which a student is identifiable. A school, parent or guardian may ask us to remove an image at any time, without giving a reason, and we will do so.

## Intellectual property

The text, design, curriculum materials and career pathway content on this site belong to ${siteConfig.legalName}.

**Teachers may freely use our materials in the classroom.** That is what they are for. Copying substantial portions of this site for commercial use, or republishing our career pathway content as your own, is not permitted.

Organisation names and logos belong to their respective owners.

## Contributions you send us

When you submit a form, you confirm the information is accurate and that you are authorised to send it — particularly when requesting a visit on behalf of a school.

Do not submit another person's personal data without their knowledge.

## Donations

Donation forms on this site record an intention to give. No payment instrument is collected or processed here. Payment instructions are sent separately, and a receipt is issued once a gift clears.

Where you direct a gift toward a particular county or school, we will honour that where practicable. If it becomes impossible, we will contact you before applying it elsewhere.

## External links

We link to institutions, regulators and partner organisations. We do not control those sites and are not responsible for their content or their privacy practices.

## Liability

This site is provided as is. We take reasonable care to keep it accurate and available, but we do not warrant that it will be uninterrupted or error-free.

To the extent permitted by Kenyan law, we are not liable for indirect or consequential loss arising from use of this site or reliance on the guidance published here. Nothing in these terms excludes liability that cannot lawfully be excluded.

## Governing law

These terms are governed by the laws of Kenya, and the Kenyan courts have exclusive jurisdiction.

## Contact

Questions about these terms: [${siteConfig.contact.email}](mailto:${siteConfig.contact.email}) or ${siteConfig.contact.phone}.
`;

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description={`The terms governing this website and participation in the programme, including what our career guidance is and is not. Last updated ${LAST_UPDATED}.`}
        breadcrumbs={[
          { label: "Home", href: routes.home },
          { label: "Terms of Use", href: routes.terms },
        ]}
      />

      <Section>
        <div className="container-prose">
          <MarkdownContent content={TERMS} />
        </div>
      </Section>
    </>
  );
}
