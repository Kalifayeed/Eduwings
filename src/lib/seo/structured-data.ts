import { siteConfig } from "@/config/site";
import { siteUrl } from "@/lib/env";

/**
 * Schema.org JSON-LD builders.
 *
 * Structured data is what turns a listing into a rich result. Each builder
 * returns a plain object; the `JsonLd` component serialises it into the page.
 */

type Json = Record<string, unknown>;

const ORGANISATION_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

export function organizationSchema(): Json {
  return {
    "@type": "EducationalOrganization",
    "@id": ORGANISATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.legalName,
    url: siteUrl,
    logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg` },
    description: siteConfig.description,
    foundingDate: String(siteConfig.foundingYear),
    founder: {
      "@type": "Person",
      name: siteConfig.founder.name,
      jobTitle: siteConfig.founder.role,
    },
    slogan: siteConfig.tagline,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.locality,
      addressRegion: siteConfig.contact.address.region,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: siteConfig.contact.address.countryCode,
    },
    sameAs: siteConfig.social.map((item) => item.href),
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteUrl,
    name: siteConfig.name,
    description: siteConfig.shortDescription,
    inLanguage: siteConfig.language,
    publisher: { "@id": ORGANISATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, siteUrl).toString(),
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string | null;
  authorName?: string | null;
  image?: string | null;
}

export function articleSchema(input: ArticleSchemaInput): Json {
  return {
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: new URL(input.path, siteUrl).toString(),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: { "@type": "Person", name: input.authorName ?? siteConfig.name },
    publisher: { "@id": ORGANISATION_ID },
    image: input.image ? [new URL(input.image, siteUrl).toString()] : undefined,
    inLanguage: siteConfig.language,
  };
}

export interface EventSchemaInput {
  title: string;
  description: string;
  path: string;
  startsAt: string;
  endsAt?: string | null;
  venue: string;
  locality: string;
  isOnline?: boolean;
  isFree?: boolean;
}

export function eventSchema(input: EventSchemaInput): Json {
  return {
    "@type": "EducationEvent",
    name: input.title,
    description: input.description,
    url: new URL(input.path, siteUrl).toString(),
    startDate: input.startsAt,
    endDate: input.endsAt ?? undefined,
    eventAttendanceMode: input.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: input.isOnline
      ? { "@type": "VirtualLocation", url: new URL(input.path, siteUrl).toString() }
      : {
          "@type": "Place",
          name: input.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: input.locality,
            addressCountry: siteConfig.contact.address.countryCode,
          },
        },
    organizer: { "@id": ORGANISATION_ID },
    isAccessibleForFree: input.isFree ?? true,
  };
}

export function faqSchema(items: { question: string; answer: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export interface OccupationSchemaInput {
  title: string;
  description: string;
  path: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string;
}

export function occupationSchema(input: OccupationSchemaInput): Json {
  return {
    "@type": "Occupation",
    name: input.title,
    description: input.description,
    mainEntityOfPage: new URL(input.path, siteUrl).toString(),
    occupationLocation: { "@type": "Country", name: siteConfig.contact.address.country },
    ...(input.salaryMin && input.salaryMax
      ? {
          estimatedSalary: {
            "@type": "MonetaryAmountDistribution",
            name: "base",
            currency: input.currency ?? "KES",
            duration: "P1M",
            minValue: input.salaryMin,
            maxValue: input.salaryMax,
          },
        }
      : {}),
  };
}

/** Wrap one or more schema objects in a single `@graph` document. */
export function graph(...nodes: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes };
}
