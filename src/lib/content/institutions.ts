import type { ArtMotif } from "@/components/media/placeholder-art";

/**
 * Aviation training institutions in Kenya.
 *
 * Editorial reference content, like `careers.ts` — always static, never
 * CMS-backed. Every entry here is sourced from KCAA's own published
 * "Approved Training Organizations" list (personnel-licencing/approved-
 * training-organization) plus the institution's own official page, never
 * from third-party aggregator sites.
 *
 * This is a deliberately incomplete first pass: KCAA's list runs to ~28
 * organizations and this file covers three, chosen because they map to the
 * highest-traffic career pages. Extend it incrementally rather than trying
 * to cover the full list in one PR — each addition needs the same two-source
 * verification, and rushing that is how this file would end up with the
 * kind of fabricated claim the whole site is trying to avoid.
 *
 * Deliberately omitted: specific fee figures (they move too often and are
 * the highest fabrication/staleness risk — send visitors to the
 * institution's own page instead) and precise course durations where no
 * verified, institution-specific figure exists.
 */

export const INSTITUTION_TYPES = [
  "Flight Training Organisation",
  "Aircraft Maintenance & Engineering School",
  "Air Traffic Services Training",
  "Aviation College / University Programme",
  "Cabin Crew & Ground Operations Training",
] as const;

export type InstitutionType = (typeof INSTITUTION_TYPES)[number];

export interface InstitutionCourse {
  title: string;
  /** The actual KCAA qualification/course code — never an invented name. */
  qualification: string;
  /** Free text. Left honestly vague where no verified figure exists. */
  durationText: string;
  entryRequirements: string[];
  /** Links this course to the careers it trains toward. */
  careerSlugs: string[];
}

export interface Institution {
  slug: string;
  name: string;
  type: InstitutionType;
  /** Confirmed against KCAA's published Approved Training Organization list. */
  kcaaApproved: boolean;
  location: { town: string; county: string };
  summary: string;
  courses: InstitutionCourse[];
  /** The institution's own official site — never a third-party aggregator. */
  website: string | null;
  contactPhone?: string;
  motif: ArtMotif;
  icon: string;
  /** What was verified, against which source, so this can be re-checked later. */
  sourceNote: string;
}

export const institutions: Institution[] = [
  {
    slug: "east-african-school-of-aviation",
    name: "East African School of Aviation",
    type: "Air Traffic Services Training",
    kcaaApproved: true,
    location: { town: "Embakasi, Nairobi", county: "Nairobi" },
    summary:
      "KCAA's own training directorate, and an ICAO Regional Training Centre of Excellence — the ninth institution worldwide to hold that status. The only organisation on KCAA's approved list training air traffic control, alongside aircraft maintenance engineering and flight operations and dispatch.",
    courses: [
      {
        title: "Air Traffic Services",
        qualification: "KCAA Air Traffic Control (ATC) rating",
        durationText: "Varies by course level — confirm directly with EASA.",
        entryRequirements: [
          "KCSE with strong Mathematics and English (confirm current minimum grades with EASA)",
          "KCAA medical fitness assessment for air traffic control personnel",
        ],
        careerSlugs: ["air-traffic-controller"],
      },
      {
        title: "Aircraft Maintenance Engineering",
        qualification: "KCAA Aircraft Maintenance Engineer's Licence (AMEL)",
        durationText: "Varies by pathway and prior qualifications — confirm directly with EASA.",
        entryRequirements: [
          "KCSE with strong Mathematics and Physics (confirm current minimum grades with EASA)",
        ],
        careerSlugs: ["aircraft-maintenance-engineer"],
      },
      {
        title: "Flight Operations and Dispatch",
        qualification: "KCAA Flight Operations and Dispatch (FOD)",
        durationText: "Confirm directly with EASA.",
        entryRequirements: ["KCSE — confirm current minimum grades with EASA"],
        careerSlugs: ["flight-dispatcher"],
      },
    ],
    website: "https://www.easa.ac.ke",
    contactPhone: "+254 20 6823607",
    motif: "tower",
    icon: "Radio",
    sourceNote:
      "Listed as ATO No. 1 (approved courses: FOD, ATC, AMEL) on KCAA's official Approved Training Organizations list. Cross-checked against easa.ac.ke and kcaa.or.ke/easa.",
  },
  {
    slug: "kenya-school-of-flying",
    name: "Kenya School of Flying",
    type: "Flight Training Organisation",
    kcaaApproved: true,
    location: { town: "Wilson Airport, Nairobi", county: "Nairobi" },
    summary:
      "One of Kenya's longest-running flight training organisations, based at Wilson Airport with additional training locations at Malindi Airport and Orly Airpark. Trains through the full pilot licence sequence, from first solo to airline transport pilot.",
    courses: [
      {
        title: "Private Pilot Licence",
        qualification: "KCAA PPL",
        durationText: "Confirm directly with the school — depends on flying frequency.",
        entryRequirements: [
          "Minimum age 17 for licence issue (KCAA requirement)",
          "KCAA Class 2 medical certificate",
        ],
        careerSlugs: ["pilot"],
      },
      {
        title: "Commercial Pilot Licence",
        qualification: "KCAA CPL, with Instrument and Multi-Engine ratings available",
        durationText: "Confirm directly with the school — depends on flying frequency and route.",
        entryRequirements: [
          "KCSE with Mathematics and Physics (confirm current minimum grades with the school)",
          "KCAA Class 1 medical certificate",
        ],
        careerSlugs: ["pilot"],
      },
      {
        title: "Airline Transport Pilot Licence",
        qualification: "KCAA ATPL",
        durationText: "Requires substantial logged flight hours beyond CPL — confirm with the school.",
        entryRequirements: ["Holds a CPL and meets KCAA's minimum flight-hour requirement"],
        careerSlugs: ["pilot"],
      },
    ],
    website: "https://kenyaschoolofflying.com",
    motif: "aircraft",
    icon: "Plane",
    sourceNote:
      "Listed as ATO No. 2 (approved courses: PPL, CPL, ATPL, Multi-Engine, IR, FIR) on KCAA's official Approved Training Organizations list. Cross-checked against kenyaschoolofflying.com.",
  },
  {
    slug: "kenya-aeronautical-college",
    name: "Kenya Aeronautical College",
    type: "Flight Training Organisation",
    kcaaApproved: true,
    location: { town: "Wilson Airport, Nairobi", county: "Nairobi" },
    summary:
      "A Nairobi aviation college whose flying school is KCAA-approved for private and commercial pilot training, with a second training location at Malindi Airport. The wider college also advertises other aviation programmes; only the KCAA-approved flying courses are listed here.",
    courses: [
      {
        title: "Private and Commercial Pilot Licence",
        qualification: "KCAA PPL / CPL, with Multi-Engine and Instrument ratings",
        durationText: "Confirm directly with the college.",
        entryRequirements: [
          "Minimum age 17 for PPL issue (KCAA requirement)",
          "KCAA medical certificate appropriate to the licence sought",
        ],
        careerSlugs: ["pilot"],
      },
      {
        title: "Flight Operations and Dispatch",
        qualification: "KCAA Flight Operations and Dispatch (FOD)",
        durationText: "Confirm directly with the college.",
        entryRequirements: ["KCSE — confirm current minimum grades with the college"],
        careerSlugs: ["flight-dispatcher"],
      },
    ],
    website: "https://kac.co.ke",
    motif: "engineering",
    icon: "Wrench",
    sourceNote:
      "Listed as ATO No. 12, \"Kenya Aeronautical College Flying School\" (approved courses: PPL, CPL, Multi-Engine-IR, FOD) on KCAA's official Approved Training Organizations list. Cross-checked against kac.co.ke.",
  },
];

export const institutionsBySlug = new Map(
  institutions.map((institution) => [institution.slug, institution]),
);

export function getInstitution(slug: string): Institution | undefined {
  return institutionsBySlug.get(slug);
}

export function getInstitutionsByType(type: InstitutionType): Institution[] {
  return institutions.filter((institution) => institution.type === type);
}

/** Reverse lookup from a career — keeps `careers.ts` itself untouched. */
export function getInstitutionsForCareer(careerSlug: string): Institution[] {
  return institutions.filter((institution) =>
    institution.courses.some((course) => course.careerSlugs.includes(careerSlug)),
  );
}
