import type { Partner } from "@/lib/content/types";
import { published } from "@/lib/content/static/seed-utils";

/**
 * Seed partner and sponsor records.
 *
 * These are illustrative placeholder organisations, deliberately generic so the
 * page structure can be reviewed before real partnership agreements are signed.
 * Replace them through the CMS — never present a placeholder as a real partner.
 */
const seed = [
  {
    id: "prt-kenya-airways-academy",
    slug: "national-carrier-training-academy",
    name: "National Carrier Training Academy",
    kind: "partner",
    tier: "Founding",
    category: "Training Institution",
    summary:
      "The flag carrier's training arm, which opens its simulators and instructors to EduWings students.",
    contribution:
      "Simulator access for the Cockpit Experience, plus first officers and training captains released to lead Sky Talk sessions.",
    websiteUrl: null,
    sinceYear: 2023,
    sortOrder: 1,
  },
  {
    id: "prt-nairobi-airport-authority",
    slug: "nairobi-airport-authority",
    name: "Nairobi Airport Authority",
    kind: "partner",
    tier: "Founding",
    category: "Airport",
    summary: "Operator of the country's principal international gateway.",
    contribution:
      "Airside access for supervised student tours, and operations staff who host the behind-the-terminal programme.",
    websiteUrl: null,
    sinceYear: 2023,
    sortOrder: 2,
  },
  {
    id: "prt-civil-aviation-authority",
    slug: "civil-aviation-authority",
    name: "Civil Aviation Authority",
    kind: "partner",
    tier: "Platinum",
    category: "Regulator",
    summary: "The national regulator for licensing, airworthiness and airspace.",
    contribution:
      "Verification of every licensing pathway published on this site, and inspectors who explain regulation to students in plain language.",
    websiteUrl: null,
    sinceYear: 2024,
    sortOrder: 3,
  },
  {
    id: "prt-east-african-school-of-aviation",
    slug: "east-african-school-of-aviation",
    name: "East African School of Aviation",
    kind: "partner",
    tier: "Platinum",
    category: "Training Institution",
    summary: "Regional training centre for controllers, engineers and operations professionals.",
    contribution:
      "Accurate entry requirements and intake information for the career pathways, and instructors at every career fair.",
    websiteUrl: null,
    sinceYear: 2024,
    sortOrder: 4,
  },
  {
    id: "prt-coastal-mro",
    slug: "coastal-aircraft-maintenance",
    name: "Coastal Aircraft Maintenance",
    kind: "partner",
    tier: "Gold",
    category: "Corporate",
    summary: "An approved maintenance organisation serving the coastal region.",
    contribution:
      "Hangar visits and licensed engineers who show students what certifying an aircraft actually involves.",
    websiteUrl: null,
    sinceYear: 2025,
    sortOrder: 5,
  },
  {
    id: "prt-rift-valley-air-services",
    slug: "rift-valley-air-services",
    name: "Rift Valley Air Services",
    kind: "partner",
    tier: "Silver",
    category: "Airline",
    summary: "A regional operator flying into short strips across the north and west.",
    contribution:
      "Pilots and dispatchers for upcountry school visits, and aircraft for static displays at regional events.",
    websiteUrl: null,
    sinceYear: 2025,
    sortOrder: 6,
  },
  {
    id: "prt-national-meteorological-service",
    slug: "national-meteorological-service",
    name: "National Meteorological Service",
    kind: "partner",
    tier: "Silver",
    category: "Regulator",
    summary: "Provider of aeronautical forecasting and the country's meteorological watch office.",
    contribution:
      "Forecasters who deliver the Weather Brief module, and real briefing material for classroom use.",
    websiteUrl: null,
    sinceYear: 2025,
    sortOrder: 7,
  },
  {
    id: "spn-horizon-foundation",
    slug: "horizon-education-foundation",
    name: "Horizon Education Foundation",
    kind: "sponsor",
    tier: "Founding",
    category: "Foundation",
    summary: "An education funder focused on widening access to STEM careers.",
    contribution:
      "Funds the upcountry visit programme in full — 24 schools in counties with no prior aviation exposure.",
    websiteUrl: null,
    sinceYear: 2023,
    sortOrder: 1,
  },
  {
    id: "spn-summit-energy",
    slug: "summit-energy-group",
    name: "Summit Energy Group",
    kind: "sponsor",
    tier: "Platinum",
    category: "Corporate",
    summary: "An energy company with a long-running technical skills programme.",
    contribution:
      "Funds the simulator fleet and the transport that gets it to schools outside Nairobi.",
    websiteUrl: null,
    sinceYear: 2024,
    sortOrder: 2,
  },
  {
    id: "spn-meridian-bank",
    slug: "meridian-bank",
    name: "Meridian Bank",
    kind: "sponsor",
    tier: "Gold",
    category: "Corporate",
    summary: "A retail bank investing in youth education across East Africa.",
    contribution: "Sponsors the annual Open Day and the printed career pathway materials.",
    websiteUrl: null,
    sinceYear: 2025,
    sortOrder: 3,
  },
  {
    id: "spn-savannah-telecom",
    slug: "savannah-telecom",
    name: "Savannah Telecom",
    kind: "sponsor",
    tier: "Gold",
    category: "Corporate",
    summary: "A telecommunications operator supporting digital skills in schools.",
    contribution: "Funds the Coast Aviation Career Fair and connectivity for the parent webinars.",
    websiteUrl: null,
    sinceYear: 2025,
    sortOrder: 4,
  },
  {
    id: "spn-lakeview-sacco",
    slug: "lakeview-sacco",
    name: "Lakeview SACCO",
    kind: "sponsor",
    tier: "Community",
    category: "Corporate",
    summary: "A member-owned cooperative in the western region.",
    contribution: "Funds school visits across Kisumu and Siaya counties — five schools a year.",
    websiteUrl: null,
    sinceYear: 2026,
    sortOrder: 5,
  },
  {
    id: "spn-national-broadcaster",
    slug: "national-broadcaster",
    name: "National Broadcaster",
    kind: "sponsor",
    tier: "Community",
    category: "Media",
    summary: "The public service broadcaster.",
    contribution:
      "Airtime for the aviation careers series and coverage that reaches schools we have not yet visited.",
    websiteUrl: null,
    sinceYear: 2026,
    sortOrder: 6,
  },
] as const;

export const partners: Partner[] = seed.map((item) => ({
  ...item,
  logoUrl: null,
  ...published(),
}));
