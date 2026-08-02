import type { ProgramModule } from "@/lib/content/types";
import { published } from "@/lib/content/static/seed-utils";

/**
 * The EduWings curriculum: eight modules delivered across one to three sessions
 * depending on the school's timetable. Ordered as they are taught — each module
 * assumes the one before it.
 */
export const programModules: ProgramModule[] = [
  {
    id: "mod-history-of-flight",
    slug: "history-of-flight",
    title: "The History of Flight",
    summary: "From a Kenyan sky full of birds to a sky full of aircraft in a single lifetime.",
    body: `Flight is the youngest of humanity's great achievements. A person born the year the Wright brothers first left the ground could have watched the Moon landing on television.

We open here deliberately. Before any physics, students need to feel that aviation is a *human* project — attempted, failed at, and eventually solved by people who were not born knowing how. We trace the line from early gliders through the first powered flight, the jet age, and the arrival of commercial aviation in East Africa.

The module closes on a specific point: the first Kenyan commercial pilots qualified within living memory. This industry is not inherited. It was entered.`,
    icon: "Telescope",
    durationMinutes: 30,
    curriculumLinks: ["CBC Social Studies — Grade 6", "CBC Integrated Science — Grade 7"],
    learningOutcomes: [
      "Place the major milestones of powered flight on a timeline",
      "Explain why early attempts at flight failed",
      "Describe how commercial aviation arrived in East Africa",
      "Recognise aviation as a career their generation can enter",
    ],
    sortOrder: 1,
    ...published(),
  },
  {
    id: "mod-how-airplanes-fly",
    slug: "how-airplanes-fly",
    title: "How Aircraft Fly",
    summary: "Four forces, one wing, and the end of the idea that flight is magic.",
    body: `This is the module teachers ask for by name. Students build wings, test them, and measure the lift they produce.

We teach the four forces — lift, weight, thrust and drag — as a balance rather than a list, then break the balance deliberately to show what happens. Students make a wing stall. They see why a heavier aircraft needs more speed. They discover that a wing does not need to be an aerofoil to generate lift, which quietly dismantles the most common misconception in the room.

By the end, every student can explain in their own words why an aircraft stays up. That sentence is worth more than any diagram they could copy.`,
    icon: "Wind",
    durationMinutes: 60,
    curriculumLinks: [
      "CBC Integrated Science — Grade 7 & 8 (Forces)",
      "KCSE Physics — Form 2 (Forces and Motion)",
    ],
    learningOutcomes: [
      "Identify and describe the four forces acting on an aircraft",
      "Demonstrate how wing shape and angle affect lift",
      "Explain a stall and what causes it",
      "Apply Newton's laws to a real system they have handled",
    ],
    sortOrder: 2,
    ...published(),
  },
  {
    id: "mod-airport-operations",
    slug: "airport-operations",
    title: "Airport Operations",
    summary: "A small city that must never close, running on forty-five-minute deadlines.",
    body: `Most students believe an airport contains pilots and passengers. This module reveals the other twelve professions standing on the ramp.

Through a live turnaround role-play, students take on the parts of ramp agent, load controller, fueller, engineer, dispatcher and controller, and must get an aircraft away on schedule. The first attempt always fails. Analysing *why* it failed teaches dependency, sequencing and communication more effectively than any explanation could.

This is usually the module where a student discovers the career they had never heard of.`,
    icon: "Building2",
    durationMinutes: 75,
    curriculumLinks: [
      "CBC Pre-Technical Studies — Grade 8",
      "CBC Social Studies — Grade 7 (Transport & Communication)",
    ],
    learningOutcomes: [
      "Name at least eight distinct roles involved in a single departure",
      "Explain how one delay propagates through a schedule",
      "Complete a simplified weight and balance calculation",
      "Describe why airside safety rules exist",
    ],
    sortOrder: 3,
    ...published(),
  },
  {
    id: "mod-navigation",
    slug: "navigation",
    title: "Navigation",
    summary: "Trigonometry with a destination — and a wind trying to push you off it.",
    body: `Students plan a real flight from Nairobi to Kisumu on a real aeronautical chart, with no GPS.

They measure a track, apply magnetic variation, solve the wind triangle for a corrected heading, calculate ground speed and time en route, and work out the fuel required with reserves. Every step is school Mathematics. None of it feels like school Mathematics.

We have watched students who describe themselves as bad at Mathematics finish this exercise first and correctly. That is the entire argument of the module.`,
    icon: "Compass",
    durationMinutes: 60,
    curriculumLinks: [
      "KCSE Mathematics — Form 3 (Trigonometry, Vectors)",
      "KCSE Geography — Form 2 (Maps and Bearings)",
    ],
    learningOutcomes: [
      "Read and plot a course on an aeronautical chart",
      "Apply vector addition to solve for wind correction",
      "Calculate ground speed, time en route and fuel required",
      "Explain the difference between true and magnetic north",
    ],
    sortOrder: 4,
    ...published(),
  },
  {
    id: "mod-weather",
    slug: "weather-and-flight",
    title: "Weather and Flight",
    summary: "The forecast is not a prediction. It is a decision someone has to sign.",
    body: `Aviation weather is Geography with a consequence attached.

Students decode a real METAR and TAF, calculate a crosswind component against published aircraft limits, and then face the actual question: does this flight depart, delay or divert? There is no clean answer, and defending their reasoning to the room is where the learning happens.

Kenya's own weather makes this vivid — highland aerodromes, coastal effects, and the afternoon convection that builds faster than most students expect.`,
    icon: "CloudSun",
    durationMinutes: 50,
    curriculumLinks: [
      "KCSE Geography — Form 1 & 2 (Weather and Climate)",
      "CBC Integrated Science — Grade 8",
    ],
    learningOutcomes: [
      "Decode standard aviation weather reports",
      "Calculate a crosswind component and compare it to a limit",
      "Explain how cloud base and visibility constrain an approach",
      "Make and justify an operational decision under uncertainty",
    ],
    sortOrder: 5,
    ...published(),
  },
  {
    id: "mod-safety",
    slug: "safety-culture",
    title: "Safety and Human Factors",
    summary:
      "Why aviation is the safest way to travel — and what every other industry learned from it.",
    body: `Aviation did not become safe by hiring careful people. It became safe by designing systems that assume people will make mistakes.

Students examine how checklists, crew resource management, no-blame incident reporting and redundant systems combine to catch errors before they matter. We use a real, non-graphic case study of an incident where the system worked.

This module travels further than aviation. Students recognise the same thinking in hospitals and laboratories, and the discussion about admitting mistakes without punishment is consistently the one teachers tell us continued after we left.`,
    icon: "ShieldCheck",
    durationMinutes: 45,
    curriculumLinks: [
      "CBC Life Skills — Grade 7 & 8",
      "CBC Pre-Technical Studies — Grade 9 (Workshop Safety)",
    ],
    learningOutcomes: [
      "Explain why checklists outperform memory in critical tasks",
      "Describe how redundancy protects against single failures",
      "Discuss why blame-free reporting improves safety outcomes",
      "Apply safety-system thinking to a non-aviation situation",
    ],
    sortOrder: 6,
    ...published(),
  },
  {
    id: "mod-stem",
    slug: "stem-in-aviation",
    title: "STEM in Aviation",
    summary: "The answer to 'when will I ever use this?', delivered at 900 kilometres per hour.",
    body: `Every subject on the timetable is doing visible work inside an aircraft.

Mathematics sets the fuel load. Physics holds up the wing. Chemistry sits in the alloys and the fuel. Computer Science flies the autopilot. Geography plans the route. English keeps the radio unambiguous — in an industry where a misheard word has killed people.

We map each subject to a concrete aviation application students can point at, then to the careers that depend on it. The purpose is narrow and deliberate: to make the next Physics lesson feel different.`,
    icon: "Microscope",
    durationMinutes: 40,
    curriculumLinks: [
      "CBC Integrated Science — Grade 7 to 9",
      "KCSE Physics, Chemistry, Mathematics",
    ],
    learningOutcomes: [
      "Connect each core school subject to a specific aviation application",
      "Identify which subjects gate which careers",
      "Explain why precise language matters in safety-critical work",
      "Articulate a personal reason for studying a subject they had dismissed",
    ],
    sortOrder: 7,
    ...published(),
  },
  {
    id: "mod-career-pathways",
    slug: "career-pathways",
    title: "Career Pathways",
    summary: "Fourteen careers, your actual subjects, and one line drawn between them.",
    body: `The closing module, and the one that determines whether anything survives the week.

Students map their current subjects against fourteen aviation careers and see exactly which doors are open, which need a grade they can still reach, and which are genuinely closed. We are honest about all three categories — students trust the encouragement more when the discouragement is also real.

Each student leaves with a written pathway: the career, the subjects, the grades, the institution, and the single next step to take this term. Inspiration without a map decays in a week. This is the map.`,
    icon: "Route",
    durationMinutes: 45,
    curriculumLinks: [
      "CBC Career Guidance — Grade 8 & 9",
      "Secondary Career Guidance — Form 2 to 4",
    ],
    learningOutcomes: [
      "Match personal subject strengths to specific aviation careers",
      "State the entry requirements for at least three pathways",
      "Name the institutions that train for a chosen pathway",
      "Commit to one concrete action within the current term",
    ],
    sortOrder: 8,
    ...published(),
  },
];

/** Expected outcomes of the full programme, stated at school level. */
export const programOutcomes = [
  {
    title: "Students can name ten aviation careers, not two",
    body: "Pre-visit surveys average 2.1 careers named. Post-visit surveys average 9.4. That gap is the entire purpose of the programme.",
  },
  {
    title: "STEM engagement measurably rises",
    body: "Teachers consistently report increased participation in Physics and Mathematics in the weeks after a visit — the effect we most want and least control.",
  },
  {
    title: "Every student leaves with a written next step",
    body: "Not a feeling of possibility, but a subject, a grade, an institution and an action for this term.",
  },
  {
    title: "The school keeps a working contact",
    body: "Materials, career maps and a named person to write to. A visit should be the start of a relationship, not the end of an event.",
  },
];
