import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { MarkdownContent } from "@/components/content/markdown";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects personal data, including data about students.`,
  path: routes.privacy,
});

const LAST_UPDATED = "1 August 2026";

const POLICY = `
## Who we are

${siteConfig.legalName} ("EduWings", "we") runs an aviation awareness programme for primary and secondary schools in Kenya. We are the data controller for the personal data described in this policy.

You can reach us at [${siteConfig.contact.email}](mailto:${siteConfig.contact.email}) or on ${siteConfig.contact.phone}.

## What we collect, and why

We only collect data that someone has actively given us through a form on this site.

**School visit requests** — school name, county, level, approximate student numbers, and the name, role, email and phone number of the person requesting the visit. We use this solely to arrange and deliver the visit.

**Contact enquiries** — name, email, optional phone number, topic and message. Used to reply to you.

**Volunteer applications** — name, contact details, profession, years of experience, availability and county. Used to assess and coordinate volunteering. Volunteering with students requires a background check; we will explain that process separately before any check is carried out.

**Partnership and sponsorship enquiries** — organisation, contact details and the content of your enquiry.

**Donation intentions** — name, contact details, amount and frequency. **We do not collect or process card or M-Pesa details on this website.** Payment instructions are sent separately.

**Newsletter subscriptions** — email address, and a name if you provide one.

**Event registrations** — name, contact details, organisation and number of attendees. Airside events at airports additionally require identification details, which are collected separately and shared only with the airport operator as a condition of access.

## Students and children

We do not collect personal data directly from students through this website. Where a school arranges a visit, any student-level information — such as year groups or numbers — is provided by the school, not by students.

**Photography.** We photograph and occasionally film sessions. We obtain permission from the school before publishing any image in which a student is identifiable, and we will remove an image on request from a school, parent or guardian without asking for a reason.

**Surveys.** The before-and-after career recall surveys we run in classrooms are anonymous. They record answers, never names.

## What we do not do

We do not sell personal data. We do not share it with advertisers. We do not use it for automated decision-making or profiling. We do not track visitors across other websites.

## Cookies and analytics

This site sets no advertising or tracking cookies.

We store a single preference locally in your browser — your light or dark theme choice. It never leaves your device and is not personal data.

If analytics are enabled on this deployment, we use a privacy-preserving, cookie-free provider that records aggregate page views without building a profile of individual visitors.

## Where your data is held

Form submissions are stored in a managed PostgreSQL database provided by Supabase, and transactional email is sent through Resend. Both are processors acting on our instructions, and both may store data outside Kenya. We rely on their contractual data protection commitments for those transfers.

## How long we keep it

- **Visit requests and enquiries** — three years from last contact, so we can maintain a relationship with a school across academic years.
- **Volunteer records** — for as long as you volunteer, and two years afterwards.
- **Newsletter subscriptions** — until you unsubscribe.
- **Donation records** — seven years, as required for financial records.

## Your rights

Under the Kenyan Data Protection Act 2019 you have the right to access the personal data we hold about you, to have it corrected, to have it deleted, to object to how we use it, and to receive a copy in a portable format.

To exercise any of these, email [${siteConfig.contact.email}](mailto:${siteConfig.contact.email}). We will respond within thirty days. If you are not satisfied with our response, you may complain to the Office of the Data Protection Commissioner.

## Security

Data is encrypted in transit and at rest. Access to submitted data is restricted to named team members and enforced at the database level rather than by convention. We apply rate limiting and input validation to every form on this site.

## Changes

If we change this policy materially, we will update the date below and, where the change affects you directly, tell subscribers by email.
`;

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`How we collect, use and protect personal data — including, particularly carefully, data relating to students. Last updated ${LAST_UPDATED}.`}
        breadcrumbs={[
          { label: "Home", href: routes.home },
          { label: "Privacy Policy", href: routes.privacy },
        ]}
      />

      <Section>
        <div className="container-prose">
          <MarkdownContent content={POLICY} />
        </div>
      </Section>
    </>
  );
}
