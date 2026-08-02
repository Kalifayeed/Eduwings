import type { School } from "@/lib/content/types";
import { published } from "@/lib/content/static/seed-utils";

/**
 * Participating schools. A representative sample of the full register — the
 * public page shows reach and geographic spread rather than a complete list.
 */
const seed = [
  {
    id: "sch-kyeleni",
    name: "Kyeleni Secondary School",
    level: "Secondary",
    county: "Machakos",
    town: "Machakos",
    studentsReached: 412,
    firstVisitAt: "2024-03-12",
    visitCount: 3,
  },
  {
    id: "sch-st-marys",
    name: "St. Mary's Secondary School",
    level: "Secondary",
    county: "Kisumu",
    town: "Kisumu",
    studentsReached: 380,
    firstVisitAt: "2024-07-19",
    visitCount: 2,
  },
  {
    id: "sch-nyakach",
    name: "Nyakach Girls' High School",
    level: "Secondary",
    county: "Kisumu",
    town: "Nyakach",
    studentsReached: 296,
    firstVisitAt: "2025-02-06",
    visitCount: 2,
  },
  {
    id: "sch-highridge",
    name: "Highridge Primary School",
    level: "Primary",
    county: "Nairobi",
    town: "Nairobi",
    studentsReached: 340,
    firstVisitAt: "2023-09-14",
    visitCount: 4,
  },
  {
    id: "sch-mombasa-tech",
    name: "Mombasa Technical High School",
    level: "Secondary",
    county: "Mombasa",
    town: "Mombasa",
    studentsReached: 455,
    firstVisitAt: "2024-11-08",
    visitCount: 3,
  },
  {
    id: "sch-nakuru-day",
    name: "Nakuru Day Secondary School",
    level: "Secondary",
    county: "Nakuru",
    town: "Nakuru",
    studentsReached: 388,
    firstVisitAt: "2025-01-23",
    visitCount: 2,
  },
  {
    id: "sch-eldoret-academy",
    name: "Eldoret Aviation Academy Feeder School",
    level: "Mixed",
    county: "Uasin Gishu",
    town: "Eldoret",
    studentsReached: 264,
    firstVisitAt: "2025-04-17",
    visitCount: 1,
  },
  {
    id: "sch-garissa-boys",
    name: "Garissa Boys' Secondary School",
    level: "Secondary",
    county: "Garissa",
    town: "Garissa",
    studentsReached: 310,
    firstVisitAt: "2025-06-05",
    visitCount: 1,
  },
  {
    id: "sch-nyeri-girls",
    name: "Nyeri Girls' High School",
    level: "Secondary",
    county: "Nyeri",
    town: "Nyeri",
    studentsReached: 352,
    firstVisitAt: "2024-05-30",
    visitCount: 2,
  },
  {
    id: "sch-kakamega-primary",
    name: "Kakamega Central Primary School",
    level: "Primary",
    county: "Kakamega",
    town: "Kakamega",
    studentsReached: 298,
    firstVisitAt: "2025-08-21",
    visitCount: 1,
  },
  {
    id: "sch-kitui-mixed",
    name: "Kitui Mixed Day School",
    level: "Mixed",
    county: "Kitui",
    town: "Kitui",
    studentsReached: 276,
    firstVisitAt: "2025-10-09",
    visitCount: 1,
  },
  {
    id: "sch-lodwar-secondary",
    name: "Lodwar Secondary School",
    level: "Secondary",
    county: "Turkana",
    town: "Lodwar",
    studentsReached: 221,
    firstVisitAt: "2026-02-19",
    visitCount: 1,
  },
] as const;

export const schools: School[] = seed.map((item) => ({
  ...item,
  logoUrl: null,
  ...published(),
}));

/** Counties reached, derived rather than duplicated. */
export const countiesReached = [...new Set(schools.map((school) => school.county))].sort();
