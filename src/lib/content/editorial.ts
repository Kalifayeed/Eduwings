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
    detail: "Each one connects school subjects with courses and career opportunities.",
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

/* Our story */

export const ourStory = [
  "Eduwings was founded by Meldah Magova to address a gap she had seen firsthand: many young learners discover aviation careers only when they are finishing secondary school and have already begun making decisions about their future.",
  "Through her work in education, Meldah saw how early exposure could give learners more time to explore their interests and understand the paths available to them. She envisioned introducing aviation from as early as Grade 4, when curiosity is growing and possibilities still feel wide open.",
  "Aviation is often associated with pilots, but the industry extends far beyond the flight deck. It offers careers in aircraft engineering, air traffic control, cabin crew services, airport operations, meteorology, aviation safety, management, and many other fields. Without access to people and places in the industry, learners may never know these opportunities exist.",
  "Eduwings brings aviation closer to learners through career guidance, mentorship, conversations with industry professionals, and visits to aviation facilities. It also connects learners with institutions and pathways that can help them turn an early interest into an informed ambition.",
  "What began as a vision for greater exposure has grown into a platform for discovery and hands-on learning. Eduwings is guided by a simple belief: no learner should miss an opportunity in aviation simply because they never had the chance to see it.",
] as const;

/* ──────────────────────────────── Timeline ────────────────────────────── */

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
}

export const timeline: TimelineEntry[] = [
  {
    year: "2023",
    title: "A vision for earlier exposure",
    body: "Eduwings was founded by Meldah Magova to address a gap she had seen firsthand: many young learners discover aviation careers only when they are finishing secondary school and have already begun making decisions about their future.",
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
    tagline: "Explore a simulator at an aviation training facility.",
    body: "After the school-based modules, EduWings organises a field trip to an aviation facility with simulators. Learners can observe demonstrations or take part in supervised sessions where the host permits. Simulators are not brought to schools. Dates, access, activity duration and charges are confirmed in the field-trip quotation.",
    highlights: [
      "Observe a simulator demonstration or join a supervised session where available",
      "Explore flight controls and aviation communication with the host’s instructors",
      "Understand instrument scan and why pilots trust instruments over instinct",
      "See a checklist used the way professionals use one",
    ],
    durationMinutes: 90,
    groupSize: "Group size and rotations confirmed with host",
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
      "Get Quotation for your school’s requirements. Fees depend on the selected modules, school level, learner numbers, delivery schedule and location. Field-trip coordination, transport, facility access, simulator activities and meals are itemised separately where applicable. Only items expressly listed in the quotation are included.",
    audience: "Schools",
  },
  {
    question: "How long does a visit take, and what do we need to provide?",
    answer:
      "The complete Primary & Junior modules provide 4 hours 50 minutes of teaching; the Secondary & Senior modules provide 7 hours 20 minutes. We agree the number of school sessions in advance. Please provide a suitable room, power and a projection surface. The field trip takes place after the modules and has its own confirmed schedule.",
    audience: "Schools",
  },
  {
    question: "Do you bring flight simulators to schools?",
    answer:
      "EduWings does not bring simulators to schools. After the modules, we organise a separately quoted field trip to an aviation facility with simulators. Demonstrations or supervised hands-on sessions take place at the host facility, subject to its availability, age requirements, capacity and operating conditions.",
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
      "Professional training requirements differ by pathway and institution. Explore the relevant career catalogue, then contact the named provider for current admission information and a full breakdown of its requirements. EduWings can help learners understand their options through school awareness and guidance.",
    audience: "Students",
  },
  {
    question: "I am not strong at Mathematics. Is aviation closed to me?",
    answer:
      "No. Cabin crew, aviation security, airport commercial roles, ground operations and customer service are genuine aviation careers with real progression, and none of them are gated on advanced Mathematics. That said, if you want the flight deck or engineering, Mathematics is not negotiable — and it is more learnable than most students have been led to believe.",
    audience: "Students",
  },
  {
    question: "Does EduWings offer professional aviation courses?",
    answer:
      "EduWings provides aviation awareness training, mentorship and career guidance for school learners. Professional courses and qualifications are offered by independent institutions. Our career catalogues explain the study routes and link to official course and licensing information.",
    audience: "Parents",
  },
  {
    question: "Is aviation a stable career for my child?",
    answer:
      "Aviation is cyclical and was hit hard by the pandemic. It is also structurally growing across Africa, and several of these careers — licensed engineering above all — hold internationally portable qualifications that are in persistent global shortage. We encourage families to look at the specific pathway rather than the industry as a whole.",
    audience: "Parents",
  },
  {
    question: "Does my child have to become a pilot?",
    answer:
      "No — this is the single biggest misconception we correct with parents as much as with students. Piloting is one of fourteen documented pathways. Engineering, air traffic control, aviation meteorology, airport management and several other careers offer strong progression with different entry requirements, different training costs and different personalities suited to them.",
    audience: "Parents",
  },
  {
    question: "What subjects should my child focus on?",
    answer:
      "It depends entirely on which pathway interests them. The flight deck and engineering routes need strong Mathematics and Physics; several ground, operations and cabin roles do not gate on either. Every career page on this site states the actual subject requirement for that specific pathway rather than a generic answer.",
    audience: "Parents",
  },
  {
    question: "When should my child start preparing?",
    answer:
      "As early as is comfortable — mainly because Mathematics and Physics compound, and a student who commits to them in Grade 7 has a very different KCSE outcome than one who decides in Form 3. That said, several pathways have accessible entry points later, including after KCSE. Earlier is an advantage, not a requirement.",
    audience: "Parents",
  },
  {
    question: "I do not know the industry. How can I actually help?",
    answer:
      "You do not need aviation knowledge to help — you need to ask your school to request a quotation, sit with your child through the career pages on this site, and take their questions seriously rather than steering them toward what sounds safest to you. Most of what a student needs at this stage is exposure and a specific next step, both of which the programme provides.",
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

/* ────────────────────────────── The journey ────────────────────────────── */

export interface JourneyStage {
  stage: string;
  title: string;
  body: string;
  icon: string;
}

export const journeyStages: JourneyStage[] = [
  {
    stage: "Awareness",
    title: "A session in the classroom",
    body: "A talk, a STEM activity or a Sky Talk with a working professional introduces the full breadth of aviation careers — not just the two most students can already name.",
    icon: "Lightbulb",
  },
  {
    stage: "Exposure",
    title: "Real environments, not slides",
    body: "After the modules, EduWings organises a separately quoted field trip to an aviation facility with simulators. Access and activities are agreed with the host in advance.",
    icon: "MapPinned",
  },
  {
    stage: "Guidance",
    title: "Subjects, grades, licences",
    body: "Every career page states the actual entry requirement — the subjects, the grade, the licence, the institution — so ambition has something specific to attach to.",
    icon: "Route",
  },
  {
    stage: "Experience",
    title: "Meeting people who do the job",
    body: "Twenty unscripted minutes with a first officer, an engineer or a controller answers the questions a slide deck cannot: what it pays, whether it is hard, whether someone like them can do it.",
    icon: "Users",
  },
  {
    stage: "Career Direction",
    title: "A written first step",
    body: "Every session ends with a concrete next action for the student to take that term — not a feeling, a step.",
    icon: "Compass",
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
