/**
 * Aviation career catalogue.
 *
 * This is editorial reference content rather than CMS data: it changes rarely,
 * must be identical for every visitor, and benefits from being fully statically
 * rendered and type-checked. Keeping it in the repository means each career page
 * is generated at build time with no database round-trip.
 *
 * Salary bands are gross monthly KES figures for the Kenyan market, expressed as
 * ranges from entry level to experienced. They are indicative guidance for
 * students, not offers, and every career page says so.
 */

import type { ArtMotif } from "@/components/media/placeholder-art";

export const CAREER_DISCIPLINES = [
  {
    id: "flight-operations",
    label: "Flight Operations",
    blurb: "The people who fly the aircraft and look after everyone on board.",
  },
  {
    id: "engineering",
    label: "Engineering & Design",
    blurb: "The people who build, maintain and certify the machine itself.",
  },
  {
    id: "ground-operations",
    label: "Ground Operations",
    blurb: "The people who move aircraft, cargo and passengers safely on the ground.",
  },
  {
    id: "safety-and-control",
    label: "Safety & Control",
    blurb: "The people who keep separation, security and situational awareness.",
  },
] as const;

export type CareerDisciplineId = (typeof CAREER_DISCIPLINES)[number]["id"];

export interface SalaryBand {
  /** Gross monthly KES. */
  entry: number;
  experienced: number;
  note?: string;
}

export interface CareerPathwayStep {
  stage: string;
  detail: string;
}

export interface Career {
  slug: string;
  title: string;
  discipline: CareerDisciplineId;
  /** One sentence a 12-year-old will understand and remember. */
  hook: string;
  summary: string;
  /** Markdown. The long-form "what this job actually is" section. */
  overview: string;
  dayInTheLife: string[];
  skills: string[];
  subjects: string[];
  pathway: CareerPathwayStep[];
  salary: SalaryBand | null;
  growth: string;
  /** Realistic outlook note — demand, competition, where the jobs are. */
  outlook: string;
  motif: ArtMotif;
  /** Lucide icon name resolved by `resolveIcon`. */
  icon: string;
  featured: boolean;
}

export const careers: Career[] = [
  {
    slug: "pilot",
    title: "Pilot",
    discipline: "flight-operations",
    hook: "You are responsible for the aircraft, everyone in it, and every decision from pushback to parking brake.",
    summary:
      "Commercial pilots operate aircraft for airlines, cargo carriers, charter operators and humanitarian missions.",
    overview: `A pilot's job is far less about steering than most people imagine. Modern airliners fly themselves for most of a route. What a pilot is actually paid for is **judgement**: reading weather that has not happened yet, managing fuel against alternates, running checklists under pressure, and deciding — sometimes in seconds — between two imperfect options.

Kenya's position as East Africa's aviation hub means pilots here fly an unusually varied mix: scheduled international routes out of Nairobi, regional turboprop work into short strips, cargo runs, and humanitarian flights into places roads cannot reach.

You will spend your career being tested. Licence renewals, simulator checks and medicals continue until the day you retire. Pilots who love the job describe that as the appeal, not the cost.`,
    dayInTheLife: [
      "Report roughly 90 minutes before departure for briefing: weather, NOTAMs, fuel figures, and the technical log.",
      "Walk around the aircraft yourself — you sign for its condition.",
      "Fly the sector, sharing duties with the other pilot and swapping the flying and monitoring roles.",
      "Manage the unexpected: a diversion, a sick passenger, a runway change on short final.",
      "Complete the paperwork, hand over the aircraft, and start the rest clock before the next duty.",
    ],
    skills: [
      "Decision-making under time pressure",
      "Spatial awareness and mental arithmetic",
      "Clear, disciplined radio communication",
      "Teamwork and assertiveness in a two-person crew",
      "Calm under fatigue and disruption",
    ],
    subjects: ["Mathematics", "Physics", "English", "Geography"],
    pathway: [
      {
        stage: "School",
        detail:
          "Strong KCSE grades, ideally C+ or above overall with Mathematics, Physics and English at C+.",
      },
      {
        stage: "Class 1 Medical",
        detail:
          "Obtain a KCAA Class 1 medical certificate before spending money on training — it is the gate everything else depends on.",
      },
      {
        stage: "Private Pilot Licence",
        detail: "Around 45 hours of flight training plus ground school theory.",
      },
      {
        stage: "Commercial Pilot Licence",
        detail:
          "200+ total hours, instrument rating and multi-engine rating. 18–24 months at an approved training organisation.",
      },
      {
        stage: "Type Rating",
        detail: "Aircraft-specific training, usually funded by or bonded to an airline.",
      },
      {
        stage: "First Officer",
        detail: "Line training, then scheduled flying while building hours toward command.",
      },
    ],
    salary: {
      entry: 180000,
      experienced: 900000,
      note: "First officers on turboprops start lower; wide-body captains at flag carriers earn considerably more, plus allowances.",
    },
    growth:
      "First Officer → Senior First Officer → Captain → Training Captain or Fleet Manager. Many pilots move into flight safety, operations management or examining later in their careers.",
    outlook:
      "Training is expensive and competition for first jobs is genuinely hard — this is the honest part. But regional fleet growth and a wave of retirements mean demand for qualified pilots in East Africa is rising, and instructing is a common route to building the hours airlines want.",
    motif: "aircraft",
    icon: "Plane",
    featured: true,
  },
  {
    slug: "cabin-crew",
    title: "Cabin Crew",
    discipline: "flight-operations",
    hook: "You are trained to evacuate 180 people in 90 seconds. Serving the drinks is the small part of the job.",
    summary:
      "Cabin crew are safety professionals first: trained in evacuation, firefighting, first aid and security, with hospitality on top.",
    overview: `Ask a passenger what cabin crew do and they will describe the trolley. Ask a regulator and you will get a different answer: cabin crew exist because someone has to get everyone off a burning aircraft in ninety seconds, in the dark, in smoke, possibly on water.

Every crew member is certified in fire suppression, decompression procedures, first aid, restraint of disruptive passengers and emergency evacuation, and is re-tested annually. The service element is real and matters commercially — but it sits on top of a safety role.

It suits people who are genuinely energised by other people, who can stay warm while exhausted, and who want to see places most of their friends will not.`,
    dayInTheLife: [
      "Pre-flight briefing: the senior crew member quizzes the team on safety equipment and procedures.",
      "Check every piece of emergency equipment on board before boarding begins.",
      "Board and settle passengers, watching for anyone who may need help in an evacuation.",
      "Run the cabin service, then the cabin: medical events, nervous flyers, turbulence management.",
      "Secure the cabin for landing, disembark, and either turn the aircraft around or head to the hotel.",
    ],
    skills: [
      "Composure in emergencies",
      "Genuine hospitality and cultural sensitivity",
      "Physical stamina across time zones",
      "Conflict de-escalation",
      "Second and third languages",
    ],
    subjects: ["English", "Kiswahili", "Business Studies", "Geography"],
    pathway: [
      { stage: "School", detail: "KCSE mean grade C or above, with strong English and Kiswahili." },
      {
        stage: "Minimum requirements",
        detail:
          "Usually 18+, a valid passport, and a height/reach requirement so you can operate emergency exits and overhead bins.",
      },
      {
        stage: "Airline cabin crew course",
        detail:
          "6–12 weeks of airline-run training covering safety, service, security and first aid.",
      },
      { stage: "Line flying", detail: "Supervised sectors before flying as a full crew member." },
      {
        stage: "Recurrent training",
        detail: "Annual safety and emergency procedures re-certification, for your entire career.",
      },
    ],
    salary: {
      entry: 60000,
      experienced: 220000,
      note: "Basic salary plus per-diem allowances, which make up a significant share of take-home pay on long-haul routes.",
    },
    growth:
      "Cabin Crew → Senior Cabin Crew → Cabin Manager / Purser. Common onward moves into crew training, recruitment, in-flight service management and ground operations.",
    outlook:
      "Recruitment is cyclical and tracks fleet growth closely. Language skills and previous customer-facing work are the two things that most reliably separate successful applicants.",
    motif: "students",
    icon: "Users",
    featured: true,
  },
  {
    slug: "aircraft-maintenance-engineer",
    title: "Aircraft Maintenance Engineer",
    discipline: "engineering",
    hook: "Your signature is what legally allows an aircraft to fly. Nobody else can give it.",
    summary:
      "Licensed engineers inspect, repair and certify aircraft as airworthy — the last technical authority before departure.",
    overview: `An aircraft cannot depart unless a licensed engineer has certified it as fit to fly. That certification is a personal legal responsibility, held by a named individual, and it is why this career carries authority out of proportion to its public profile.

The work spans quick turnaround checks on the ramp — a tyre, a warning light, a bird strike inspection — through to heavy maintenance where an aircraft is opened up over weeks. You will read schematics, follow maintenance manuals to the letter, troubleshoot systems that interact in non-obvious ways, and document everything.

It rewards people who are methodical, physically practical, and comfortable saying "no, it does not fly" to people who very much want it to fly.`,
    dayInTheLife: [
      "Review the technical log for defects reported by the flight crew.",
      "Troubleshoot a fault down to the failed component using the manufacturer's fault isolation manual.",
      "Carry out the repair to the exact procedure — no improvisation, ever.",
      "Complete a functional test, then sign the Certificate of Release to Service.",
      "Hand over open work clearly to the next shift.",
    ],
    skills: [
      "Systematic fault diagnosis",
      "Precision and documentation discipline",
      "Reading technical drawings and wiring diagrams",
      "Mechanical and electrical hand skills",
      "Absolute integrity under commercial pressure",
    ],
    subjects: ["Mathematics", "Physics", "Chemistry", "Pre-Technical Studies"],
    pathway: [
      {
        stage: "School",
        detail:
          "KCSE C+ with Mathematics and Physics at C+ — these are hard requirements, not preferences.",
      },
      {
        stage: "Approved training",
        detail:
          "Diploma in Aeronautical Engineering at an approved maintenance training organisation, typically 3 years.",
      },
      {
        stage: "Licence modules",
        detail: "Pass the theory examinations for your category (B1 mechanical or B2 avionics).",
      },
      {
        stage: "Practical experience",
        detail: "2–4 years of supervised, logged maintenance experience on type.",
      },
      {
        stage: "KCAA licence",
        detail:
          "Aircraft Maintenance Engineer licence issued, then type ratings added per aircraft.",
      },
    ],
    salary: {
      entry: 90000,
      experienced: 450000,
      note: "Licensed engineers with multiple type ratings command a substantial premium, particularly on wide-body types.",
    },
    growth:
      "Technician → Licensed Engineer → Certifying Engineer → Maintenance Controller, Quality Manager or Continuing Airworthiness Manager.",
    outlook:
      "Persistent global shortage. Kenya's MRO capability at Nairobi and Mombasa is expanding, and licensed engineers are among the most portable professionals in the industry — a KCAA licence with EASA conversion opens doors worldwide.",
    motif: "engineering",
    icon: "Wrench",
    featured: true,
  },
  {
    slug: "air-traffic-controller",
    title: "Air Traffic Controller",
    discipline: "safety-and-control",
    hook: "You hold a three-dimensional picture of a hundred square kilometres of sky in your head, and you keep every aircraft in it apart.",
    summary:
      "Controllers direct aircraft on the ground and in the air, maintaining safe separation and orderly flow.",
    overview: `Air traffic control is the closest thing aviation has to a pure cognitive sport. You build and maintain a mental model of every aircraft in your sector — where it is, where it is going, how fast it is climbing, what it will conflict with in four minutes — and you update that model continuously while talking, listening and typing.

Controllers work in distinct disciplines: **aerodrome** control handles the runway and the immediate circuit; **approach** sequences arrivals into a stream; **area** control manages aircraft en route at altitude.

The training washout rate is high and the selection is unapologetically demanding, because the job cannot be done adequately — only well. Those who make it describe a level of focus they never found anywhere else.`,
    dayInTheLife: [
      "Take over a position with a formal handover of every aircraft and every instruction outstanding.",
      "Sequence arrivals so they land at the exact spacing the runway can absorb.",
      "Resolve a developing conflict by issuing a level, heading or speed change before it becomes one.",
      "Coordinate with adjacent sectors as aircraft cross boundaries.",
      "Take a mandatory break — fatigue management is regulated, not optional.",
    ],
    skills: [
      "Three-dimensional spatial reasoning",
      "Sustained concentration and rapid task-switching",
      "Precise, unambiguous phraseology",
      "Short-term memory under load",
      "Decisiveness without hesitation",
    ],
    subjects: ["Mathematics", "Physics", "English", "Geography"],
    pathway: [
      { stage: "School", detail: "KCSE C+ or above with Mathematics, Physics and English at C+." },
      {
        stage: "Aptitude selection",
        detail:
          "Pass cognitive and spatial aptitude testing — this filters most applicants out before training.",
      },
      {
        stage: "East African School of Aviation",
        detail:
          "Ab-initio ATC training covering rules of the air, navigation, meteorology and simulation.",
      },
      { stage: "Rating training", detail: "Specialise in aerodrome, approach or area control." },
      {
        stage: "On-the-job training",
        detail: "Live control under an instructor's licence until validated on the unit.",
      },
    ],
    salary: {
      entry: 110000,
      experienced: 420000,
      note: "Shift, night and rating allowances are a meaningful addition to basic pay.",
    },
    growth:
      "Controller → Watch Supervisor → Unit Manager. Alternative routes into ATC instruction, airspace design, safety investigation and ICAO/regional regulatory roles.",
    outlook:
      "Recruitment happens in cohorts rather than continuously, so timing matters. Airspace modernisation across East Africa is creating demand for controllers who understand performance-based navigation.",
    motif: "radar",
    icon: "Radar",
    featured: true,
  },
  {
    slug: "aeronautical-meteorologist",
    title: "Aviation Meteorologist",
    discipline: "safety-and-control",
    hook: "Every flight plan in the country is built on a forecast someone had to be brave enough to sign.",
    summary:
      "Aviation meteorologists forecast the specific weather phenomena that affect flight and brief operational decision-makers.",
    overview: `Aviation weather is a specialism, not general forecasting. Pilots and dispatchers do not need to know whether it will be pleasant — they need to know cloud base, visibility, crosswind component, freezing level, thunderstorm cells, wind shear and turbulence, at specific aerodromes, at specific times.

You will issue TAFs and METARs, monitor developing convection, and brief operations teams when a decision has to be made about whether a route or a landing is viable. When you get it wrong, aircraft divert and money burns; when you get it right, nobody notices. That asymmetry is the job.

Kenya's geography makes it genuinely interesting: highland aerodromes, coastal effects, seasonal convergence zones and afternoon convection that builds fast.`,
    dayInTheLife: [
      "Analyse overnight model output and satellite imagery against what actually happened.",
      "Issue and amend terminal aerodrome forecasts for the aerodromes you cover.",
      "Watch a convective cell develop and decide whether it will affect the approach path.",
      "Brief airline operations and ATC on significant weather.",
      "Verify yesterday's forecasts — the discipline that makes you better.",
    ],
    skills: [
      "Atmospheric physics and numerical model interpretation",
      "Pattern recognition from satellite and radar",
      "Communicating uncertainty precisely",
      "Data analysis and programming (increasingly essential)",
      "Composure when the answer must be given now",
    ],
    subjects: ["Mathematics", "Physics", "Geography", "Computer Studies"],
    pathway: [
      { stage: "School", detail: "KCSE C+ with strong Mathematics, Physics and Geography." },
      { stage: "Degree", detail: "BSc in Meteorology, Physics or Atmospheric Science." },
      {
        stage: "WMO qualification",
        detail:
          "Complete World Meteorological Organization aeronautical meteorological forecaster competencies.",
      },
      {
        stage: "Aviation specialisation",
        detail: "Aeronautical meteorology training and unit-specific certification.",
      },
      {
        stage: "Operational forecaster",
        detail: "Shift forecasting at a meteorological watch office.",
      },
    ],
    salary: {
      entry: 85000,
      experienced: 300000,
      note: "Public service scales dominate; airline and research roles can exceed these.",
    },
    growth:
      "Forecaster → Senior Forecaster → Meteorological Watch Office lead, or into climate research, aviation safety analysis and modelling.",
    outlook:
      "Small profession, steady demand, and increasingly computational. Graduates who can code — Python, model post-processing, data pipelines — are markedly more employable.",
    motif: "weather",
    icon: "CloudSun",
    featured: false,
  },
  {
    slug: "airport-manager",
    title: "Airport Manager",
    discipline: "ground-operations",
    hook: "An airport is a small city that must never stop. Someone has to run it.",
    summary:
      "Airport managers run the safe, compliant and commercially viable operation of an aerodrome and everything on it.",
    overview: `An airport is simultaneously a regulated safety environment, a border post, a shopping centre, a construction site and a logistics hub. The manager's job is to hold all of that together against a fixed constraint: the runway cannot close and the flights cannot stop.

The role spans airside safety and compliance, terminal operations and passenger experience, commercial revenue from retail and concessions, capital projects, and coordination with regulators, airlines, ground handlers, immigration, customs and security agencies.

It suits people who like systems and people in equal measure, and who can hold a five-year capital plan and a broken baggage belt in mind at the same time.`,
    dayInTheLife: [
      "Chair the morning operations meeting: yesterday's disruptions, today's constraints.",
      "Walk airside to inspect pavement, markings, lighting and wildlife control.",
      "Resolve a stand allocation conflict between two airlines.",
      "Review a regulatory audit finding and agree corrective action.",
      "Meet a concession partner about terminal retail performance.",
    ],
    skills: [
      "Operations and safety management systems",
      "Stakeholder negotiation across agencies",
      "Commercial and budget literacy",
      "Crisis and incident command",
      "Regulatory compliance",
    ],
    subjects: ["Mathematics", "Business Studies", "Geography", "English"],
    pathway: [
      { stage: "School", detail: "KCSE C+ or above, with solid Mathematics and English." },
      {
        stage: "Degree",
        detail: "Aviation Management, Business Administration, Logistics or Engineering.",
      },
      {
        stage: "Operational role",
        detail:
          "Start in terminal operations, airside operations or ground handling — credibility here is earned on the ramp.",
      },
      {
        stage: "Professional certification",
        detail: "IATA/ACI airport operations and safety management qualifications.",
      },
      { stage: "Management", detail: "Duty Manager → Operations Manager → Airport Manager." },
    ],
    salary: {
      entry: 90000,
      experienced: 500000,
      note: "Varies sharply between a regional aerodrome and an international gateway.",
    },
    growth:
      "Duty Manager → Operations Manager → Airport Manager → Director of Airports or regulatory leadership.",
    outlook:
      "Kenya's regional aerodrome upgrade programme and rising passenger volumes are creating management roles outside Nairobi and Mombasa — often the fastest route to real responsibility early.",
    motif: "tower",
    icon: "Building2",
    featured: false,
  },
  {
    slug: "flight-dispatcher",
    title: "Flight Dispatcher",
    discipline: "flight-operations",
    hook: "The captain and the dispatcher jointly sign the flight plan. You share legal responsibility for it.",
    summary:
      "Flight dispatchers plan routes, fuel and payload, then monitor the flight and support the crew from the ground.",
    overview: `In most operations the dispatcher and the captain share responsibility for the operational flight plan. That means the route, the fuel, the alternates and the payload are your work as much as theirs.

You will balance a genuine optimisation problem under real constraints: carrying more fuel costs fuel; carrying less removes options. Weather, airspace closures, aircraft performance, runway length, crew duty limits and payload all interact, and the answer has to be legal, safe and commercially sensible.

Once the aircraft departs, you follow it. If something changes en route, you are the person on the ground working the alternatives.`,
    dayInTheLife: [
      "Build the operational flight plan: route, levels, fuel, alternates.",
      "Check NOTAMs, weather and aircraft performance against runway data.",
      "Brief the crew and jointly agree the plan.",
      "Monitor the flight and re-plan around an unexpected airspace closure.",
      "Hand over active flights at shift change with full context.",
    ],
    skills: [
      "Applied performance and fuel calculation",
      "Weather and NOTAM interpretation",
      "Fast, structured problem-solving",
      "Clear written and radio communication",
      "Working accurately at speed",
    ],
    subjects: ["Mathematics", "Physics", "Geography", "English"],
    pathway: [
      { stage: "School", detail: "KCSE C+ with Mathematics and Physics at C or above." },
      {
        stage: "Dispatcher course",
        detail:
          "Flight Operations Officer / Flight Dispatcher licence course, typically 4–6 months.",
      },
      {
        stage: "KCAA licence",
        detail: "Pass written examinations and obtain the Flight Operations Officer licence.",
      },
      {
        stage: "Operations control",
        detail: "Begin in an operations control centre under supervision.",
      },
      {
        stage: "Type familiarisation",
        detail: "Build knowledge of specific fleet performance and route networks.",
      },
    ],
    salary: {
      entry: 70000,
      experienced: 280000,
      note: "Shift allowances apply; operations control runs 24 hours.",
    },
    growth:
      "Dispatcher → Senior Dispatcher → Operations Control Centre Manager, or across into network planning and crew scheduling.",
    outlook:
      "An excellent and under-advertised entry point into airline operations — shorter and far cheaper to train for than a pilot licence, with strong onward mobility.",
    motif: "navigation",
    icon: "Route",
    featured: false,
  },
  {
    slug: "aviation-security-officer",
    title: "Aviation Security Officer",
    discipline: "safety-and-control",
    hook: "Every single person who boards an aircraft has passed through a system you are responsible for.",
    summary:
      "Aviation security professionals protect passengers, crew, aircraft and facilities against acts of unlawful interference.",
    overview: `Aviation security is one of the most heavily regulated fields in the industry, governed by ICAO Annex 17 and enforced nationally. It covers passenger and baggage screening, cargo security, access control, airside vehicle discipline, and the behavioural detection work that catches what machines cannot.

The professional version of this career is analytical rather than physical: threat assessment, screening system design, quality control testing, audit and compliance. Officers who progress are the ones who understand *why* a procedure exists, not only how to apply it.

It demands consistency. The thousandth bag must be screened as carefully as the first.`,
    dayInTheLife: [
      "Brief the screening team on current threat assessments and procedural changes.",
      "Conduct and supervise passenger, cabin and hold baggage screening.",
      "Run covert quality-control tests on the screening process.",
      "Investigate an access control breach and write it up.",
      "Audit a cargo agent's known-consignor compliance.",
    ],
    skills: [
      "Sustained vigilance and attention to detail",
      "Behavioural observation",
      "Regulatory knowledge and audit discipline",
      "De-escalation and professional authority",
      "Integrity beyond question",
    ],
    subjects: ["English", "Kiswahili", "Business Studies", "Computer Studies"],
    pathway: [
      { stage: "School", detail: "KCSE mean grade C or above." },
      {
        stage: "Basic AVSEC certification",
        detail: "ICAO-aligned aviation security training and national certification.",
      },
      {
        stage: "Screener certification",
        detail: "Equipment-specific certification, with mandatory recurrent testing.",
      },
      {
        stage: "Specialisation",
        detail: "Cargo security, quality control, or behavioural detection.",
      },
      { stage: "Management", detail: "AVSEC instructor, auditor or security manager roles." },
    ],
    salary: {
      entry: 45000,
      experienced: 250000,
      note: "Certified AVSEC instructors and auditors sit well above the operational band.",
    },
    growth:
      "Screening Officer → Supervisor → AVSEC Instructor / Auditor → Security Manager → national regulatory inspection.",
    outlook:
      "The most accessible entry point in this catalogue in terms of qualifications, with a clear and well-defined ladder for those who pursue instructor and auditor certification.",
    motif: "instruments",
    icon: "ShieldCheck",
    featured: false,
  },
  {
    slug: "airline-operations-controller",
    title: "Airline Operations Controller",
    discipline: "ground-operations",
    hook: "When a storm closes an airport, you decide which flights live and which ones die.",
    summary:
      "Operations controllers run the airline's live network, recovering the schedule when reality diverges from the plan.",
    overview: `An airline schedule is a fragile chain of dependencies: this aircraft, then that crew, then this slot. The Operations Control Centre is where that chain is defended when something breaks.

A single technical delay in Nairobi can cascade into eight downstream cancellations by evening. Your job is to see that cascade forming and cut it off — swapping aircraft, re-crewing, retiming, consolidating, and occasionally cancelling one flight to save four.

It is high-tempo, deeply commercial and intensely operational. People who thrive here enjoy holding a whole system in mind and making consequential calls quickly with incomplete information.`,
    dayInTheLife: [
      "Take handover of the live network and every known risk in it.",
      "Track a delay developing and model the downstream impact.",
      "Swap an aircraft between routes to protect a long-haul connection.",
      "Coordinate with crewing on duty-time limits before they become illegal.",
      "Communicate decisions to stations, ground handling and customer teams.",
    ],
    skills: [
      "Systems thinking and cascade modelling",
      "Fast triage and prioritisation",
      "Commercial judgement",
      "Cross-team coordination under pressure",
      "Composure during irregular operations",
    ],
    subjects: ["Mathematics", "Business Studies", "Geography", "Computer Studies"],
    pathway: [
      { stage: "School", detail: "KCSE C+ with good Mathematics." },
      {
        stage: "Degree or diploma",
        detail: "Aviation Management, Operations, Logistics or a numerate discipline.",
      },
      {
        stage: "Operational grounding",
        detail:
          "Time in station operations, dispatch or crew control — network intuition is learned, not taught.",
      },
      {
        stage: "OCC role",
        detail: "Join the operations control centre, initially on monitoring duties.",
      },
      { stage: "Controller", detail: "Take responsibility for network recovery decisions." },
    ],
    salary: {
      entry: 75000,
      experienced: 320000,
      note: "24/7 shift patterns attract allowances.",
    },
    growth:
      "OCC Analyst → Operations Controller → Duty Manager Operations → Head of Operations Control, or into network and schedule planning.",
    outlook:
      "Growing as airlines invest in disruption-management technology. Controllers who can work with data and optimisation tools are increasingly valuable.",
    motif: "instruments",
    icon: "Activity",
    featured: false,
  },
  {
    slug: "ground-handling-specialist",
    title: "Ground Handling Specialist",
    discipline: "ground-operations",
    hook: "Forty-five minutes to unload, clean, cater, fuel, load and dispatch. Go.",
    summary:
      "Ground handlers turn aircraft around on the ramp: loading, servicing, marshalling and dispatching every flight.",
    overview: `The ramp is where aviation's schedule is actually won or lost. A turnaround is a choreographed operation with a dozen parties working around a live aircraft in a confined, noisy, hazardous environment — and a hard deadline.

The specialist role goes well beyond lifting: **load control** calculates weight and balance and produces the loadsheet that determines whether the aircraft can safely fly; **turnaround coordination** sequences every party on the stand; **dangerous goods acceptance** is a certified legal responsibility.

Get weight and balance wrong and the aircraft's handling characteristics change. This is a serious technical job wearing a high-visibility vest.`,
    dayInTheLife: [
      "Receive the flight's load plan and brief the ramp team.",
      "Marshal the aircraft onto stand and connect ground power.",
      "Supervise unloading and loading against the load instruction report.",
      "Calculate weight and balance, issue the loadsheet to the crew.",
      "Dispatch the aircraft and confirm the stand is clear.",
    ],
    skills: [
      "Weight and balance calculation",
      "Ramp safety discipline",
      "Dangerous goods regulations",
      "Team leadership at speed",
      "Working outdoors in all conditions",
    ],
    subjects: ["Mathematics", "Physics", "Business Studies", "English"],
    pathway: [
      {
        stage: "School",
        detail: "KCSE mean grade C-, with Mathematics at C- or above for load control.",
      },
      {
        stage: "Ground handling certification",
        detail: "IATA Airport Handling and ramp safety training.",
      },
      {
        stage: "Dangerous goods",
        detail: "IATA DGR certification — a legal requirement and a genuine differentiator.",
      },
      {
        stage: "Load control",
        detail: "Weight and balance certification, then licensed load controller status.",
      },
      {
        stage: "Supervision",
        detail: "Turnaround Coordinator → Ramp Supervisor → Station Manager.",
      },
    ],
    salary: {
      entry: 35000,
      experienced: 200000,
      note: "Certified load controllers and dangerous goods specialists earn well above general ramp roles.",
    },
    growth:
      "Ramp Agent → Load Controller → Turnaround Coordinator → Ramp Supervisor → Station Manager.",
    outlook:
      "The industry's widest front door. Many senior airport and airline managers started on the ramp, and certification — not tenure — is what accelerates progression.",
    motif: "aircraft",
    icon: "Truck",
    featured: false,
  },
  {
    slug: "aircraft-designer",
    title: "Aircraft Designer",
    discipline: "engineering",
    hook: "Every curve on a wing is an argument between lift, drag, weight and cost that someone had to win.",
    summary:
      "Aircraft designers shape the structures, aerodynamics and systems of new aircraft and modifications.",
    overview: `Aircraft design is applied compromise. Every gram of structure you add for strength costs payload for the aircraft's whole service life. Every square metre of wing that helps at low speed hurts at cruise. The designer's craft is knowing which trade to make and being able to prove it.

The work is computational: CAD modelling, finite element analysis for structures, computational fluid dynamics for aerodynamics, and a great deal of validation against physical test. Certification requirements shape design as strongly as physics does.

In Kenya, the realistic near-term routes are modification design, unmanned aircraft development and supplemental type certificate work — plus a growing set of international remote engineering roles.`,
    dayInTheLife: [
      "Model a structural component and run a finite element analysis against load cases.",
      "Iterate an aerofoil section in CFD and compare against wind tunnel data.",
      "Review a design against the applicable certification specification.",
      "Work with stress, systems and manufacturing engineers on an interface problem.",
      "Document the design substantiation — the evidence, not just the answer.",
    ],
    skills: [
      "Aerodynamics and structural mechanics",
      "CAD, FEA and CFD tooling",
      "Materials science",
      "Certification literacy",
      "Rigorous technical documentation",
    ],
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Studies"],
    pathway: [
      { stage: "School", detail: "KCSE B- or above with Mathematics and Physics at B or above." },
      { stage: "Degree", detail: "BSc/BEng in Aerospace, Aeronautical or Mechanical Engineering." },
      {
        stage: "Specialisation",
        detail: "MSc in aerodynamics, structures, propulsion or flight dynamics.",
      },
      {
        stage: "Design office",
        detail: "Junior design engineer under a design organisation approval.",
      },
      { stage: "Design authority", detail: "Build toward signatory authority for design changes." },
    ],
    salary: {
      entry: 100000,
      experienced: 500000,
      note: "The highest-paying roles are with international manufacturers and design organisations.",
    },
    growth:
      "Design Engineer → Senior Design Engineer → Lead Engineer → Chief Engineer / Design Organisation signatory.",
    outlook:
      "Limited domestic design industry today — this is an honest caveat. But UAV design, modification engineering and remote roles with international OEMs are real and growing routes.",
    motif: "engineering",
    icon: "PencilRuler",
    featured: false,
  },
  {
    slug: "aerospace-engineer",
    title: "Aerospace Engineer",
    discipline: "engineering",
    hook: "The same equations that keep an airliner up put a satellite in orbit.",
    summary:
      "Aerospace engineers work across aircraft, spacecraft, propulsion and systems — from concept through test to service.",
    overview: `Aerospace engineering is broader than aircraft. It spans propulsion, avionics and control systems, materials, satellites and launch systems, and the test engineering that proves any of it works.

Kenya's space sector is young but real: the Kenya Space Agency, university CubeSat programmes and a growing earth-observation industry mean satellite and payload work is no longer purely theoretical here. Meanwhile the airline and MRO sector needs engineers in reliability, continuing airworthiness and systems integration.

If you are the student who wants to know *why* the rule is the rule, this is your discipline.`,
    dayInTheLife: [
      "Analyse in-service reliability data to find an emerging failure trend.",
      "Design and instrument a test to validate a system modification.",
      "Run trajectory or thermal analysis for a satellite payload.",
      "Present a technical case to a review board.",
      "Mentor a graduate engineer through a substantiation report.",
    ],
    skills: [
      "Applied mathematics and physics",
      "Systems engineering and requirements discipline",
      "Programming and numerical analysis",
      "Test design and data interpretation",
      "Technical writing that stands up to review",
    ],
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Studies"],
    pathway: [
      { stage: "School", detail: "KCSE B- or above with Mathematics and Physics at B or above." },
      {
        stage: "Degree",
        detail: "BSc/BEng in Aerospace, Aeronautical, Mechanical or Electrical Engineering.",
      },
      {
        stage: "Professional registration",
        detail: "Graduate engineer registration with the Engineers Board of Kenya.",
      },
      {
        stage: "Specialisation",
        detail: "Propulsion, avionics, structures, space systems or reliability.",
      },
      {
        stage: "Chartered engineer",
        detail: "Professional registration after supervised experience.",
      },
    ],
    salary: {
      entry: 95000,
      experienced: 480000,
      note: "Space agency, research and international roles vary widely from airline engineering scales.",
    },
    growth:
      "Graduate Engineer → Engineer → Senior Engineer → Principal / Chief Engineer, or into research and academia.",
    outlook:
      "The strongest long-term outlook in this catalogue. Satellite services, drone systems and aviation decarbonisation are all expanding, and the skills transfer readily across sectors.",
    motif: "world",
    icon: "Rocket",
    featured: true,
  },
  {
    slug: "drone-pilot",
    title: "Drone Pilot (RPAS Operator)",
    discipline: "flight-operations",
    hook: "The fastest-growing aviation career in Kenya, and the one you can legally start closest to leaving school.",
    summary:
      "Licensed remote pilots operate unmanned aircraft for survey, agriculture, inspection, mapping, delivery and film.",
    overview: `Remotely piloted aircraft have moved from novelty to infrastructure. In Kenya they survey farmland, inspect power lines and pipelines, map construction progress, monitor wildlife, deliver medical supplies and shoot commercial film.

Kenya regulates this properly: the KCAA requires a Remote Pilot Licence, operator certification and, for many missions, specific authorisation. That regulation is good news for anyone entering seriously, because it separates licensed professionals from hobbyists.

The money is rarely in flying. It is in what you do with the data — orthomosaics, volumetric survey, NDVI crop analysis, thermal inspection reports. The pilots who build analysis skills alongside flying skills are the ones who build businesses.`,
    dayInTheLife: [
      "Plan the mission: airspace, authorisations, weather, battery and flight geometry.",
      "Conduct a site survey and brief the ground crew on emergency procedures.",
      "Fly the automated survey grid, monitoring the aircraft throughout.",
      "Process imagery into an orthomosaic or 3D model.",
      "Deliver the analysis the client actually needs.",
    ],
    skills: [
      "Airspace and regulatory knowledge",
      "Mission planning and risk assessment",
      "Photogrammetry and GIS processing",
      "Equipment maintenance and battery discipline",
      "Client communication and pricing",
    ],
    subjects: ["Mathematics", "Physics", "Geography", "Computer Studies"],
    pathway: [
      {
        stage: "School",
        detail: "KCSE C- or above; Geography and Computer Studies are genuinely useful here.",
      },
      {
        stage: "Remote Pilot Licence",
        detail: "KCAA-approved RPL training — a few weeks, not years.",
      },
      {
        stage: "Operator certificate",
        detail: "Work under a certified Remote Operator, or certify your own operation.",
      },
      {
        stage: "Specialisation",
        detail: "Survey and mapping, agriculture, inspection, or cinematography.",
      },
      {
        stage: "Business",
        detail: "Many remote pilots build service companies rather than seeking employment.",
      },
    ],
    salary: {
      entry: 50000,
      experienced: 300000,
      note: "Project-based work is common; experienced survey operators bill per hectare or per site.",
    },
    growth:
      "Remote Pilot → Senior Pilot / Chief Remote Pilot → Operations Manager, or founder of a drone services business.",
    outlook:
      "The lowest barrier to entry and the fastest growth of any career here. Combine the licence with GIS or data analysis skills and you are genuinely scarce.",
    motif: "navigation",
    icon: "Send",
    featured: true,
  },
  {
    slug: "avionics-technician",
    title: "Avionics Technician",
    discipline: "engineering",
    hook: "A modern airliner carries hundreds of kilometres of wiring. You are the person who understands it.",
    summary:
      "Avionics technicians maintain and certify the electronic systems that navigate, communicate and control the aircraft.",
    overview: `If the airframe is the body, avionics is the nervous system: navigation, communication, autoflight, displays, surveillance, and the data buses that tie them together.

Avionics work is diagnostic. Faults are frequently intermittent, and finding them means understanding how systems interact rather than swapping boxes until the light goes out. The discipline is moving quickly toward integrated modular avionics and software-defined systems, which makes digital skills increasingly central.

It is a strong choice for students who like electronics and problem-solving and want a licensed, portable, technically respected trade.`,
    dayInTheLife: [
      "Investigate an intermittent navigation fault reported by the flight crew.",
      "Trace a wiring loom against the aircraft schematic.",
      "Load and verify a software update to an avionics unit.",
      "Carry out a functional test and certify the work.",
      "Update the aircraft's technical records precisely.",
    ],
    skills: [
      "Electronics and digital systems",
      "Schematic and wiring diagram interpretation",
      "Structured fault diagnosis",
      "Test equipment operation",
      "Meticulous record keeping",
    ],
    subjects: ["Mathematics", "Physics", "Computer Studies", "Pre-Technical Studies"],
    pathway: [
      { stage: "School", detail: "KCSE C+ with Mathematics and Physics at C+." },
      {
        stage: "Diploma",
        detail: "Aeronautical Engineering (Avionics) at an approved training organisation.",
      },
      { stage: "B2 licence modules", detail: "Pass the avionics-category theory examinations." },
      { stage: "Experience", detail: "2–4 years of logged, supervised maintenance experience." },
      {
        stage: "B2 licence",
        detail: "Category B2 Aircraft Maintenance Engineer licence with type ratings.",
      },
    ],
    salary: {
      entry: 85000,
      experienced: 420000,
      note: "B2 licence holders with modern glass-cockpit type ratings are in particularly short supply.",
    },
    growth:
      "Technician → Licensed B2 Engineer → Avionics Specialist → Engineering Manager or Continuing Airworthiness.",
    outlook:
      "Aircraft are becoming more electronic, not less. Avionics is the fastest-growing segment of aircraft maintenance and one of the most globally portable licences you can hold.",
    motif: "instruments",
    icon: "CircuitBoard",
    featured: false,
  },
];

/** Fast lookup used by the dynamic career route. */
export const careersBySlug = new Map(careers.map((career) => [career.slug, career]));

export function getCareer(slug: string): Career | undefined {
  return careersBySlug.get(slug);
}

export function getCareersByDiscipline(discipline: CareerDisciplineId): Career[] {
  return careers.filter((career) => career.discipline === discipline);
}

export function getFeaturedCareers(limit = 6): Career[] {
  return careers.filter((career) => career.featured).slice(0, limit);
}

export function disciplineLabel(id: CareerDisciplineId): string {
  return CAREER_DISCIPLINES.find((discipline) => discipline.id === id)?.label ?? id;
}
