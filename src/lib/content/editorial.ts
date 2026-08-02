/**
 * Editorial content that is authored, not administered.
 *
 * Statistics, the founding story, activities, FAQs and the timeline are written
 * by the organisation and change a few times a year. They live in the repository
 * so they are type-checked, reviewable in a pull request, and rendered fully
 * statically. Content that genuinely needs an editor — articles, events, gallery,
 * partners — goes through the CMS instead.
 */

import type { ArtMotif } from "@/components/media/placeholder-art";

/* ───────────────────────────── Impact statistics ──────────────────────── */

export interface Statistic {
  value: number;
  /** Rendered after the animated figure, e.g. "+" or "%". */
  suffix?: string;
  label: string;
  detail: string;
  icon: string;
}

export const impactStatistics: Statistic[] = [
  {
    value: 12400,
    suffix: "+",
    label: "Students reached",
    detail: "Across primary and secondary schools since our first classroom visit.",
    icon: "Users",
  },
  {
    value: 86,
    label: "Schools visited",
    detail: "From Nairobi county classrooms to schools that had never met a pilot.",
    icon: "School",
  },
  {
    value: 14,
    label: "Career pathways mapped",
    detail: "Every one documented from school subject to first salary.",
    icon: "Route",
  },
  {
    value: 31,
    label: "Volunteer professionals",
    detail: "Working pilots, engineers and controllers who give us their days off.",
    icon: "HeartHandshake",
  },
];

/* ─────────────────────────── Mission, vision, values ──────────────────── */

export const mission =
  "To place aviation within reach of every Kenyan schoolchild — not as a distant fantasy, but as a mapped, achievable career with a first step they can take this term.";

export const vision =
  "A generation of Kenyan students who grow up knowing that the aircraft overhead was designed, built, maintained, guided and flown by people who started exactly where they are sitting.";

export interface Objective {
  title: string;
  body: string;
  icon: string;
}

export const objectives: Objective[] = [
  {
    title: "Create awareness",
    body: "Introduce students to the full breadth of the aviation industry — the fourteen careers behind every departure, not just the two they can name.",
    icon: "Lightbulb",
  },
  {
    title: "Make it concrete",
    body: "Replace vague ambition with specifics: which subjects, which grades, which licence, which institution, which first job.",
    icon: "Target",
  },
  {
    title: "Put a face to the career",
    body: "Every session is delivered by a working aviation professional. Representation is not decoration; it is the mechanism.",
    icon: "Users",
  },
  {
    title: "Strengthen STEM",
    body: "Anchor Mathematics and Physics in something students can see, hear and want — the single most effective argument for the subject.",
    icon: "Microscope",
  },
  {
    title: "Reach beyond the cities",
    body: "Prioritise schools with the least existing exposure to the industry, not the ones easiest to reach.",
    icon: "MapPin",
  },
  {
    title: "Sustain the connection",
    body: "Leave every school with materials, a contact and a route back to us — a visit is a beginning, not an event.",
    icon: "HeartHandshake",
  },
];

/* ──────────────────────────────── Timeline ────────────────────────────── */

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
}

export const timeline: TimelineEntry[] = [
  {
    year: "2023",
    title: "A question with no good answer",
    body: "During a school careers day, a Form Two student asked our founder how someone becomes an aircraft engineer. Nobody in the room could answer. EduWings started as the answer to that question, written down.",
  },
  {
    year: "2023",
    title: "The first classroom",
    body: "Forty-one students, one borrowed projector, and a set of laminated cockpit photographs. Three of those students are now studying aeronautical engineering.",
  },
  {
    year: "2024",
    title: "The programme takes shape",
    body: "Ad-hoc talks became a structured eight-module curriculum, mapped against CBC learning outcomes and reviewed by practising teachers.",
  },
  {
    year: "2024",
    title: "Professionals join",
    body: "Working pilots, licensed engineers and air traffic controllers volunteered to deliver sessions. The programme stopped being a talk about aviation and became a conversation with it.",
  },
  {
    year: "2025",
    title: "Beyond Nairobi",
    body: "Visits extended to schools in counties where no student had previously met an aviation professional — the schools that need this most.",
  },
  {
    year: "2026",
    title: "Twelve thousand and counting",
    body: "Eighty-six schools. Fourteen documented career pathways. A growing list of former students now in aviation training.",
  },
];

/* ─────────────────────────────── Activities ───────────────────────────── */

export interface Activity {
  slug: string;
  title: string;
  tagline: string;
  body: string;
  /** What students physically do — the thing they will tell their parents about. */
  highlights: string[];
  durationMinutes: number;
  groupSize: string;
  suitableFor: string;
  icon: string;
  motif: ArtMotif;
}

export const activities: Activity[] = [
  {
    slug: "flight-lab",
    title: "The Flight Lab",
    tagline: "Four forces, one paper wing, and the moment physics stops being abstract.",
    body: "Students build and test wings, measure the lift they generate, and discover for themselves why an aircraft weighing 180 tonnes does not fall out of the sky. The session ends with every student able to explain lift, weight, thrust and drag in their own words — because they measured all four.",
    highlights: [
      "Build and test three wing profiles against each other",
      "Measure lift with a simple balance and a fan",
      "Explain why a wing stalls — and then make one stall",
      "Connect the result directly to the Physics syllabus",
    ],
    durationMinutes: 60,
    groupSize: "Up to 60 students",
    suitableFor: "Grade 6 – Form 4",
    icon: "Wind",
    motif: "engineering",
  },
  {
    slug: "cockpit-experience",
    title: "Cockpit Experience",
    tagline: "Take the controls. Fly the approach. Land it, or don't.",
    body: "Using desktop flight simulators, students fly a short approach into Nairobi with a working pilot talking them through it. Almost every student lands badly the first time and brilliantly the third — which is precisely the lesson about training and repetition that we want them to take away.",
    highlights: [
      "Fly a simulated approach with a licensed pilot beside you",
      "Learn the actual radio calls and use them",
      "Understand instrument scan and why pilots trust instruments over instinct",
      "See a checklist used the way professionals use one",
    ],
    durationMinutes: 90,
    groupSize: "Up to 30 students in rotation",
    suitableFor: "Grade 7 – Form 4",
    icon: "PlaneTakeoff",
    motif: "instruments",
  },
  {
    slug: "airport-city",
    title: "Airport: The City That Never Closes",
    tagline: "One aircraft. Forty-five minutes. Twelve teams who must not get in each other's way.",
    body: "A live role-play of an aircraft turnaround. Students take on the roles of ramp agent, load controller, fueller, caterer, engineer, dispatcher and controller, and must coordinate to get the aircraft away on time. It fails the first time. Understanding why is the point.",
    highlights: [
      "Run a full turnaround against a countdown clock",
      "Calculate a real weight and balance loadsheet",
      "Experience how one delay cascades into six",
      "Discover roles most students have never heard of",
    ],
    durationMinutes: 75,
    groupSize: "24 – 48 students",
    suitableFor: "Grade 7 – Form 4",
    icon: "Truck",
    motif: "tower",
  },
  {
    slug: "sky-talk",
    title: "Sky Talk",
    tagline: "Twenty minutes with someone who does the job. No slides.",
    body: "An unscripted conversation between students and a working aviation professional — a first officer, a licensed engineer, a controller. Students ask what they actually want to know: what it pays, whether it is hard, whether someone like them can really do it. The honesty is the value.",
    highlights: [
      "Meet a working professional face to face",
      "Ask anything — including about cost, failure and fear",
      "Hear a real route from a Kenyan school to a Kenyan flight deck",
      "Leave with a named contact for follow-up questions",
    ],
    durationMinutes: 45,
    groupSize: "Whole school assembly or single class",
    suitableFor: "Grade 4 – Form 4",
    icon: "Users",
    motif: "students",
  },
  {
    slug: "navigation-challenge",
    title: "The Navigation Challenge",
    tagline: "No GPS. A chart, a ruler, a compass and the wind against you.",
    body: "Teams plan a flight from Nairobi to Kisumu using a real aeronautical chart. They calculate heading, correct for wind drift, estimate time en route and work out fuel. It is trigonometry with a destination, and students who claim to hate Mathematics routinely finish first.",
    highlights: [
      "Plot a real route on a real aeronautical chart",
      "Apply the wind triangle to find a corrected heading",
      "Calculate ground speed, time en route and fuel required",
      "See Mathematics used for something with a consequence",
    ],
    durationMinutes: 60,
    groupSize: "Teams of 4, up to 48 students",
    suitableFor: "Form 1 – Form 4",
    icon: "Compass",
    motif: "navigation",
  },
  {
    slug: "weather-brief",
    title: "The Weather Brief",
    tagline: "Would you send this aircraft? Decide, and defend it.",
    body: "Students are handed a real weather briefing — cloud base, visibility, crosswind, thunderstorm activity — and must decide whether the flight departs, delays or diverts. There is no single right answer, which is exactly what makes them argue, reason and commit to a judgement.",
    highlights: [
      "Decode an actual METAR and TAF",
      "Calculate a crosswind component against aircraft limits",
      "Make and justify a go/no-go decision as a crew",
      "Connect directly to the Geography weather syllabus",
    ],
    durationMinutes: 50,
    groupSize: "Up to 60 students",
    suitableFor: "Form 1 – Form 4",
    icon: "CloudSun",
    motif: "weather",
  },
  {
    slug: "career-map",
    title: "The Career Map",
    tagline: "Fourteen careers. Your subjects. One line drawn between them.",
    body: "Every student leaves with a personalised route: the careers that fit the subjects they are strong in, the grades those careers require, the institutions that train for them, and the first concrete step to take this term. Ambition without a map is just a wish.",
    highlights: [
      "Map your current subjects against fourteen aviation careers",
      "See the exact grades and licences each pathway requires",
      "Identify institutions and their entry requirements",
      "Leave with a written first step, not a feeling",
    ],
    durationMinutes: 45,
    groupSize: "Up to 60 students",
    suitableFor: "Form 1 – Form 4",
    icon: "Route",
    motif: "learning",
  },
  {
    slug: "drone-demo",
    title: "Drone Operations Demo",
    tagline: "The aviation career you can legally begin closest to leaving school.",
    body: "A licensed remote pilot demonstrates a survey flight on the school field, then shows students the output: an orthomosaic map of their own school. The gap between 'flying a drone' and 'operating an aircraft professionally' becomes immediately, physically obvious.",
    highlights: [
      "Watch a licensed mission planned and flown",
      "See the regulations that make it a real aviation licence",
      "View a map of your own school, generated on the spot",
      "Learn the shortest credible route into a licensed aviation career",
    ],
    durationMinutes: 45,
    groupSize: "Whole school",
    suitableFor: "Grade 5 – Form 4",
    icon: "Send",
    motif: "navigation",
  },
];

export const activitiesBySlug = new Map(activities.map((activity) => [activity.slug, activity]));

/* ───────────────────────────────── FAQ ────────────────────────────────── */

export interface FaqItem {
  question: string;
  answer: string;
  audience: "Schools" | "Students" | "Parents" | "Partners" | "General";
}

export const faqs: FaqItem[] = [
  {
    question: "What does an EduWings visit cost our school?",
    answer:
      "Nothing. The programme is delivered free to schools and funded entirely by sponsors, donors and the volunteer professionals who give their time. Where a school can contribute toward travel we welcome it, but it is never a condition of a visit.",
    audience: "Schools",
  },
  {
    question: "How long does a visit take, and what do we need to provide?",
    answer:
      "A standard visit runs two to three hours and can be shaped around your timetable. We need a room that can hold the group, a power socket, and a wall or screen we can project onto. We bring everything else, including the simulators.",
    audience: "Schools",
  },
  {
    question: "Which year groups is the programme for?",
    answer:
      "Grade 4 through Form 4. Every activity has an age band, and we adjust depth rather than swapping content — the physics of lift is the same at ten and at seventeen, but the conversation is not.",
    audience: "Schools",
  },
  {
    question: "How does this connect to the curriculum?",
    answer:
      "Each module is mapped to CBC learning outcomes in Integrated Science, Mathematics, Pre-Technical Studies and Geography. Teachers receive the mapping in advance so the visit reinforces what you are already teaching rather than interrupting it.",
    audience: "Schools",
  },
  {
    question: "How far will you travel?",
    answer:
      "Anywhere in Kenya. We deliberately prioritise schools with the least existing exposure to the aviation industry, which frequently means the ones furthest from an airport. Travel distance affects our scheduling, never our willingness.",
    audience: "Schools",
  },
  {
    question: "Do I need excellent grades to work in aviation?",
    answer:
      "It depends entirely on which of the fourteen careers you mean, and this is the single biggest misconception we correct. Aircraft design requires strong Mathematics and Physics. Ground handling, cabin crew and aviation security have far more accessible entry requirements and clear routes upward. Every career page on this site states the actual requirement.",
    audience: "Students",
  },
  {
    question: "Is aviation training affordable?",
    answer:
      "Some routes are expensive and we will not pretend otherwise — a commercial pilot licence is a major investment. But a remote pilot licence takes weeks, ground handling certification is inexpensive, and an aircraft maintenance diploma costs less than many university degrees while leading to a globally portable licence. Cost varies enormously by pathway.",
    audience: "Students",
  },
  {
    question: "I am not strong at Mathematics. Is aviation closed to me?",
    answer:
      "No. Cabin crew, aviation security, airport commercial roles, ground operations and customer service are genuine aviation careers with real progression, and none of them are gated on advanced Mathematics. That said, if you want the flight deck or engineering, Mathematics is not negotiable — and it is more learnable than most students have been led to believe.",
    audience: "Students",
  },
  {
    question: "Are the salary figures on this site reliable?",
    answer:
      "They are indicative gross monthly ranges for the Kenyan market, gathered from industry contacts and published scales, and they move. Treat them as a guide to relative scale rather than a quotation. Allowances — particularly for crew and shift roles — can form a large share of actual take-home pay.",
    audience: "Parents",
  },
  {
    question: "Is aviation a stable career for my child?",
    answer:
      "Aviation is cyclical and was hit hard by the pandemic. It is also structurally growing across Africa, and several of these careers — licensed engineering above all — hold internationally portable qualifications that are in persistent global shortage. We encourage families to look at the specific pathway rather than the industry as a whole.",
    audience: "Parents",
  },
  {
    question: "How can my organisation get involved?",
    answer:
      "Three ways. Sponsor school visits, which is the most direct form of support. Open your facility for a student visit — an airport, a hangar or a control tower is worth any number of slide decks. Or release staff to volunteer as session leaders. The last one costs the least and, honestly, changes the most.",
    audience: "Partners",
  },
  {
    question: "How do you measure whether this works?",
    answer:
      "We survey students before and after each visit on how many aviation careers they can name and whether they believe those careers are open to them. We track requests for follow-up, and we keep in contact with students who go on to aviation training. Our published figures come from those records.",
    audience: "General",
  },
  {
    question: "Do you work with schools outside Kenya?",
    answer:
      "Not yet. The curriculum is mapped to the Kenyan CBC framework and the career pathways reference KCAA licensing, so it would need real adaptation to travel well. We would rather do this properly for Kenya first.",
    audience: "General",
  },
  {
    question: "How do I volunteer?",
    answer:
      "If you work in aviation in any capacity, we want to hear from you. Most volunteers give two to four days a year. You do not need teaching experience — students are far more interested in what you actually do than in how polished you are while describing it.",
    audience: "General",
  },
];

/* ──────────────────────── Why EduWings matters ────────────────────────── */

export interface Argument {
  title: string;
  body: string;
  icon: string;
}

export const whyItMatters: Argument[] = [
  {
    title: "You cannot become what you have never seen",
    body: "Career aspiration is bounded by exposure. A student who has never met an aircraft engineer does not choose against that career — the option was never presented. We are not persuading students; we are widening the list they choose from.",
    icon: "Telescope",
  },
  {
    title: "The industry is growing where the awareness is not",
    body: "African air traffic is projected to grow faster than the global average for the next two decades, while licensed engineers and controllers are in worldwide shortage. The jobs are arriving. The pipeline is not being built at the same speed.",
    icon: "Rocket",
  },
  {
    title: "Aviation makes STEM argue for itself",
    body: "'Why do we learn this?' is the hardest question in a Physics classroom. An aircraft answers it in a way no textbook can. Teachers consistently tell us the effect on engagement outlasts the visit by a term.",
    icon: "Microscope",
  },
  {
    title: "Ambition without a map goes nowhere",
    body: "Inspiration that is not followed by specifics decays within a week. Every EduWings session ends with the concrete next step — the subject, the grade, the institution, the licence. That is the part that survives.",
    icon: "Route",
  },
];
