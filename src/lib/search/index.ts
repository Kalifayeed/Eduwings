import "server-only";

import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { careers, disciplineLabel } from "@/lib/content/careers";
import { activities, faqs } from "@/lib/content/editorial";
import type { SearchGroup, SearchResult } from "@/lib/search/types";
import { truncate } from "@/lib/utils";

/**
 * Site-wide search.
 *
 * A deliberately simple scored substring index rather than a search service.
 * The corpus is a few hundred short documents; adding Algolia or a Postgres
 * full-text pipeline would add operational surface and a second source of truth
 * for no user-visible benefit at this scale. The scoring below is transparent
 * and tunable, and the whole thing runs in well under a millisecond.
 *
 * If the corpus ever outgrows this, `search()` is the only function that has to
 * change — its callers are already asynchronous.
 */

export type { SearchGroup, SearchResult } from "@/lib/search/types";

interface SearchDocument {
  id: string;
  title: string;
  description: string;
  href: string;
  group: SearchGroup;
  /** Additional matchable terms that should not be shown to the user. */
  keywords: string[];
}

/** Static, always-present destinations. */
const PAGE_DOCUMENTS: SearchDocument[] = [
  {
    id: "page-about",
    title: "About EduWings",
    description: "Our story, mission, founder and the case for the programme.",
    href: routes.about,
    group: "Page",
    keywords: ["mission", "vision", "founder", "history", "timeline", "meldah magova"],
  },
  {
    id: "page-program",
    title: "Our Programme",
    description:
      "Primary & Junior and Secondary & Senior aviation modules, teaching times and field-trip arrangements.",
    href: routes.program,
    group: "Page",
    keywords: ["curriculum", "modules", "cbc", "syllabus", "learning outcomes"],
  },
  {
    id: "page-schools",
    title: "For Schools",
    description:
      "Get Quotation for school-based aviation modules and separately costed field trips.",
    href: routes.schools,
    group: "Page",
    keywords: [
      "quotation",
      "quote",
      "fees",
      "pricing",
      "book",
      "request",
      "visit",
      "teacher",
      "head teacher",
      "timetable",
    ],
  },
  {
    id: "page-visit",
    title: "Aviation Field Trips",
    description:
      "Get Quotation for a field trip to an aviation facility with simulators after the modules.",
    href: routes.visitQuotation,
    group: "Page",
    keywords: ["quotation", "simulator", "field trip", "facility", "transport"],
  },
  {
    id: "page-gallery",
    title: "Gallery",
    description: "Photographs and film from school visits, airports and workshops.",
    href: routes.gallery,
    group: "Page",
    keywords: ["photos", "video", "images", "media"],
  },
  {
    id: "page-events",
    title: "Events",
    description: "Open days, airport tours, career fairs and webinars.",
    href: routes.events,
    group: "Page",
    keywords: ["calendar", "register", "upcoming", "tour"],
  },
  {
    id: "page-donate",
    title: "Donate",
    description:
      "Contribute towards school modules, learning materials or field trips to simulator facilities.",
    href: routes.donate,
    group: "Page",
    keywords: ["give", "support", "sponsor", "contribute", "funding"],
  },
  {
    id: "page-volunteer",
    title: "Volunteer",
    description: "Give a few hours as a working aviation professional.",
    href: routes.volunteer,
    group: "Page",
    keywords: ["help", "session leader", "mentor", "professional"],
  },
  {
    id: "page-partners",
    title: "Partners",
    description: "The airlines, airports and institutions that open their doors to us.",
    href: routes.partners,
    group: "Page",
    keywords: ["partnership", "collaborate", "airline", "airport"],
  },
  {
    id: "page-sponsors",
    title: "Sponsors",
    description: "Organisations funding classroom visits across the country.",
    href: routes.sponsors,
    group: "Page",
    keywords: ["funding", "corporate", "csr", "foundation"],
  },
  {
    id: "page-contact",
    title: "Contact",
    description: "Talk to the EduWings team directly.",
    href: routes.contact,
    group: "Page",
    keywords: ["email", "phone", "address", "map", "get in touch"],
  },
  {
    id: "page-faq",
    title: "FAQ",
    description: "Straight answers for teachers, parents and students.",
    href: routes.faq,
    group: "Page",
    keywords: ["questions", "answers", "help"],
  },
];

/** Editorial documents that never change between requests. */
const STATIC_DOCUMENTS: SearchDocument[] = [
  ...PAGE_DOCUMENTS,
  ...careers.map<SearchDocument>((career) => ({
    id: `career-${career.slug}`,
    title: career.title,
    description: career.summary,
    href: routes.career(career.slug),
    group: "Career",
    keywords: [
      disciplineLabel(career.discipline),
      ...career.skills,
      ...career.subjects,
      career.hook,
    ],
  })),
  ...activities.map<SearchDocument>((activity) => ({
    id: `activity-${activity.slug}`,
    title: activity.title,
    description: activity.tagline,
    href: `${routes.activities}#${activity.slug}`,
    group: "Activity",
    keywords: [...activity.highlights, activity.suitableFor],
  })),
  ...faqs.map<SearchDocument>((faq, index) => ({
    id: `faq-${index}`,
    title: faq.question,
    description: truncate(faq.answer, 140),
    href: `${routes.faq}#question-${index}`,
    group: "Question",
    keywords: [faq.audience],
  })),
];

/**
 * Score a document against a query.
 *
 * Weighting reflects intent: an exact title is almost always what was wanted, a
 * title prefix nearly so, and a hidden keyword match is a weak signal that
 * should surface the result without outranking a real title hit.
 */
function scoreDocument(doc: SearchDocument, terms: string[]): number {
  const title = doc.title.toLowerCase();
  const description = doc.description.toLowerCase();
  const keywords = doc.keywords.join(" ").toLowerCase();

  let score = 0;

  for (const term of terms) {
    if (title === term) score += 120;
    else if (title.startsWith(term)) score += 60;
    else if (title.includes(term)) score += 40;

    if (description.includes(term)) score += 12;
    if (keywords.includes(term)) score += 6;
  }

  // Every term must appear somewhere, so that a two-word query narrows rather
  // than widens the result set.
  const haystack = `${title} ${description} ${keywords}`;
  if (!terms.every((term) => haystack.includes(term))) return 0;

  return score;
}

/** Documents whose content lives in the CMS and must be fetched per request. */
async function dynamicDocuments(): Promise<SearchDocument[]> {
  const source = getContentSource();
  const [articles, events, programs] = await Promise.all([
    source.articles.list(),
    source.events.list({ when: "all" }),
    source.programs.list(),
  ]);

  return [
    ...articles.items.map<SearchDocument>((article) => ({
      id: `article-${article.slug}`,
      title: article.title,
      description: article.excerpt,
      href: routes.article(article.slug),
      group: "Article",
      keywords: [article.category, ...article.tags, article.authorName],
    })),
    ...events.items.map<SearchDocument>((event) => ({
      id: `event-${event.slug}`,
      title: event.title,
      description: event.summary,
      href: routes.event(event.slug),
      group: "Event",
      keywords: [event.type, event.venue, event.locality],
    })),
    ...programs.items.map<SearchDocument>((module) => ({
      id: `program-${module.slug}`,
      title: module.title,
      description: module.summary,
      href: `${routes.program}#${module.slug}`,
      group: "Programme",
      keywords: [...module.curriculumLinks, ...module.learningOutcomes],
    })),
  ];
}

export async function search(query: string, limit = 12): Promise<SearchResult[]> {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1);

  if (terms.length === 0) return [];

  const documents = [...STATIC_DOCUMENTS, ...(await dynamicDocuments())];

  return documents
    .map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      href: doc.href,
      group: doc.group,
      score: scoreDocument(doc, terms),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}
