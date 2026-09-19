/** Source-linked career and course guidance. EduWings does not award these qualifications. */
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

export interface TrainingRoute {
  title: string;
  institution: string;
  url: string;
  entryRequirements: string[];
  qualification: string;
  duration: string;
}
export interface Career {
  slug: string;
  title: string;
  discipline: CareerDisciplineId;
  hook: string;
  summary: string;
  overview: string;
  skills: string[];
  subjects: string[];
  studyTopics: string[];
  trainingRoutes: TrainingRoute[];
  requirements: string[];
  opportunities: string[];
  growth: string;
  sources: { label: string; url: string }[];
  motif: ArtMotif;
  icon: string;
  featured: boolean;
}
export const CAREER_REVIEWED_ON = "19 September 2026";
export const careers: Career[] = [
  {
    slug: "pilot",
    title: "Pilot",
    discipline: "flight-operations",
    skills: [
      "Decision-making under time pressure",
      "Spatial awareness and mental arithmetic",
      "Clear, disciplined radio communication",
      "Teamwork and assertiveness in a two-person crew",
      "Calm under fatigue and disruption",
    ],
    subjects: ["Mathematics", "Physics", "English", "Geography"],
    motif: "aircraft",
    icon: "Plane",
    featured: true,
    hook: "Learn to fly safely, plan a journey and make decisions in the cockpit.",
    summary:
      "Explore private and commercial pilot training, the licences involved and routes into professional flying.",
    overview:
      "Pilot training combines classroom study with practical flying. Students learn how an aircraft behaves, how to navigate and how to manage normal and emergency situations. The role requires preparation, disciplined procedures and clear communication with other crew and air traffic services.\n\nPrivate flying and a professional flying career follow different stages. A private licence is an early foundation; commercial work requires the appropriate professional licence, ratings and operational experience. Completing a course does not automatically secure an airline position.",
    studyTopics: [
      "Principles of flight and aircraft systems",
      "Navigation, route planning and radio communication",
      "Aviation weather and its operational effects",
      "Air law, human performance and decision-making",
      "Aircraft performance, loading and fuel planning",
      "Practical handling, instrument flying and emergency procedures",
    ],
    trainingRoutes: [
      {
        title: "Private Pilot Licence (PPL)",
        institution: "Kenya School of Flying",
        url: "https://kenyaschoolofflying.com/training-programmes/private-pilot-license/",
        entryRequirements: [
          "Confirm the school’s current academic and admission requirements.",
          "KCAA PPL issue requires at least age 17 and the appropriate Class 2 medical certificate.",
        ],
        qualification:
          "PPL: private flying privileges, not a general permission to fly for payment.",
        duration: "Depends on flying frequency, progress and weather.",
      },
      {
        title: "Commercial Pilot Licence (CPL) and additional ratings",
        institution: "Kenya School of Flying",
        url: "https://kenyaschoolofflying.com/training-programmes/commercial-pilot-license/",
        entryRequirements: [
          "KCAA CPL issue requires age 18 or above, a Class 1 medical and a qualifying private-pilot or recognised equivalent route.",
          "Complete the required knowledge, flying experience and practical assessments.",
        ],
        qualification:
          "CPL; instrument and multi-engine ratings are separate endorsements relevant to many professional roles.",
        duration:
          "Confirm the course plan and required flight experience with the approved school.",
      },
    ],
    requirements: [
      "Use a KCAA-approved school authorised for the specific course and aircraft category.",
      "Meet current medical, English-language, knowledge and practical-test requirements; requirements differ by licence and rating.",
      "Airline transport privileges and aircraft type qualifications require further experience and training beyond an initial CPL.",
    ],
    opportunities: [
      "Charter and general-aviation flying, with appropriate ratings",
      "Airline first-officer recruitment after meeting operator requirements",
      "Flight instruction after instructor qualification",
      "Survey, specialist or humanitarian aviation roles",
    ],
    growth:
      "Experience can lead to command, instruction or training and operational management. Progress depends on hours, competence, available positions and the operator’s requirements.",
    sources: [
      {
        label: "KCAA: Private Pilot Licence",
        url: "https://www.kcaa.or.ke/personnel-licencing/licencing/private-pilot-licence",
      },
      {
        label: "KCAA: Commercial Pilot Licence",
        url: "https://www.kcaa.or.ke/personnel-licencing/licencing/commercial-pilot-licence",
      },
    ],
  },
  {
    slug: "cabin-crew",
    title: "Cabin Crew",
    discipline: "flight-operations",
    skills: [
      "Composure in emergencies",
      "Genuine hospitality and cultural sensitivity",
      "Physical stamina across time zones",
      "Conflict de-escalation",
      "Second and third languages",
    ],
    subjects: ["English", "Kiswahili", "Business Studies", "Geography"],
    motif: "students",
    icon: "Users",
    featured: true,
    hook: "Support passenger safety, respond to emergencies and care for people on board.",
    summary:
      "Understand cabin-crew preparation, airline training and the Kenyan certification route.",
    overview:
      "Cabin crew are responsible for safety and passenger care inside the aircraft. Training develops communication, teamwork and the ability to respond calmly to events such as a medical emergency or evacuation. Service skills matter alongside the safety role.\n\nAn introductory airline-cabin-crew course helps students understand the profession. It is distinct from an operator’s approved training, aircraft-type preparation and the KCAA certificate needed for operational duties.",
    studyTopics: [
      "Cabin safety and emergency equipment",
      "Passenger communication and customer care",
      "First-aid awareness and emergency response",
      "Crew teamwork and human factors",
      "Security and dangerous-goods awareness",
      "Boarding, cabin preparation and service procedures",
    ],
    trainingRoutes: [
      {
        title: "IATA Certificate in Airline Cabin Crew",
        institution: "East African School of Aviation",
        url: "https://www.easa.ac.ke/course-calendar/iata-certificate-airline-cabin-crew-0",
        entryRequirements: [
          "EASA publishes general certificate entry guidance of KCSE D+ or equivalent; confirm the specific cabin-crew intake criteria.",
          "Airlines apply their own recruitment, communication and physical-task requirements.",
        ],
        qualification:
          "An introductory course certificate; operational cabin-crew certification is a separate process.",
        duration: "The published course listing states six months; confirm current dates.",
      },
    ],
    requirements: [
      "KCAA’s Cabin Crew Member Certificate requires age 18 or above, English ability and approved training with knowledge and practical assessments.",
      "Operational duties require the relevant aircraft-type qualification and current Class 2 medical certificate.",
      "A college certificate alone does not replace airline selection or the operator’s training and checks.",
    ],
    opportunities: [
      "Airline cabin crew after recruitment and certification",
      "Charter and business-aviation cabin roles",
      "Passenger-service roles using transferable skills",
      "Senior cabin crew and training roles after operational experience",
    ],
    growth:
      "With experience and additional assessment, crew may progress to senior cabin roles, instruction, cabin safety or service management.",
    sources: [
      {
        label: "EASA: IATA Certificate in Airline Cabin Crew",
        url: "https://www.easa.ac.ke/course-calendar/iata-certificate-airline-cabin-crew-0",
      },
      {
        label: "EASA: Admission guidance",
        url: "https://easa.ac.ke/faqs",
      },
      {
        label: "KCAA: Cabin Crew Member Certificate",
        url: "https://www.kcaa.or.ke/personnel-licencing/licencing/cabin-crew-member-certificate",
      },
    ],
  },
  {
    slug: "aircraft-maintenance-engineer",
    title: "Aircraft Maintenance Engineer",
    discipline: "engineering",
    skills: [
      "Systematic fault diagnosis",
      "Precision and documentation discipline",
      "Reading technical drawings and wiring diagrams",
      "Mechanical and electrical hand skills",
      "Absolute integrity under commercial pressure",
    ],
    subjects: ["Mathematics", "Physics", "Chemistry", "Pre-Technical Studies"],
    motif: "engineering",
    icon: "Wrench",
    featured: true,
    hook: "Inspect aircraft, diagnose faults and help keep them airworthy.",
    summary:
      "Explore aeronautical maintenance studies and the separate route to licensed certification privileges.",
    overview:
      "Aircraft maintenance covers scheduled inspections, troubleshooting and the repair of airframes, engines and related systems. Students combine engineering theory with workshop practice and technical documentation. Careful records and approved procedures are essential.\n\nA diploma builds technical knowledge. Permission to certify particular maintenance work comes through the appropriate licence, experience, ratings and organisational authorisation—not simply from graduating.",
    studyTopics: [
      "Aircraft structures, materials and corrosion",
      "Piston and gas-turbine engine principles",
      "Mechanical, hydraulic and pneumatic systems",
      "Workshop practice and inspection methods",
      "Maintenance manuals and technical records",
      "Human factors, airworthiness and maintenance safety",
    ],
    trainingRoutes: [
      {
        title: "Diploma in Technology (Aeronautical Engineering)",
        institution: "Technical University of Kenya",
        url: "https://intake.tukenya.ac.ke/index.php?r=courseApplication/default/home&prog=180",
        entryRequirements: [
          "Published KCSE entry: mean C, with C− in Mathematics A, Physics and English.",
          "Confirm practical-training, attachment and progression arrangements with the institution.",
        ],
        qualification:
          "Diploma in Technology; additional licensing requirements apply to certifying maintenance.",
        duration: "The published academic sequence covers three years, excluding attachment.",
      },
      {
        title: "Aeronautical Engineering: Airframes & Engines",
        institution: "East African School of Aviation",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
        entryRequirements: [
          "Confirm the course-specific subject grades and current intake with EASA.",
        ],
        qualification:
          "A diploma route into technical maintenance training; licence preparation and issue are separate stages.",
        duration: "The published diploma catalogue lists three years.",
      },
    ],
    requirements: [
      "KCAA AMEL applicants must be at least 18 and demonstrate English-language ability.",
      "Meet knowledge, experience, skill and examination requirements for the rating sought.",
      "Check what the course qualifies you to do, what supervised experience is needed and which authority issues the intended licence.",
    ],
    opportunities: [
      "Trainee aircraft maintenance technician",
      "Airframe or engine workshop roles",
      "Maintenance planning and technical records",
      "Licensed certifying roles after the required qualifications and authorisations",
    ],
    growth:
      "Progression may include licensed maintenance work, specialist workshops, planning, quality assurance or engineering supervision.",
    sources: [
      {
        label: "Technical University of Kenya: Aeronautical Engineering diploma",
        url: "https://intake.tukenya.ac.ke/index.php?r=courseApplication/default/home&prog=180",
      },
      {
        label: "EASA: Published programme catalogue",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
      },
      {
        label: "KCAA: Aircraft Maintenance Engineer licensing",
        url: "https://www.kcaa.or.ke/personnel-licencing/licencing/aircraft-maintenance-engineers",
      },
    ],
  },
  {
    slug: "air-traffic-controller",
    title: "Air Traffic Controller",
    discipline: "safety-and-control",
    skills: [
      "Three-dimensional spatial reasoning",
      "Sustained concentration and rapid task-switching",
      "Precise, unambiguous phraseology",
      "Short-term memory under load",
      "Decisiveness without hesitation",
    ],
    subjects: ["Mathematics", "Physics", "English", "Geography"],
    motif: "radar",
    icon: "Radar",
    featured: true,
    hook: "Help aircraft move safely through controlled airspace and around airports.",
    summary:
      "Explore air traffic services training, supervised operational experience and controller ratings.",
    overview:
      "Air traffic controllers organise traffic and issue instructions to support safe separation and efficient movement. The work involves continuous attention, accurate communication and decisions made within established procedures.\n\nTraining introduces airspace, procedures and simulated traffic situations before supervised work in an operational unit. Aerodrome, approach and area control are different rating areas. Course admission, employer recruitment and licence issue are separate stages.",
    studyTopics: [
      "Airspace organisation and air traffic rules",
      "Radiotelephony and standard phraseology",
      "Aerodrome, approach and area-control principles",
      "Navigation, weather and aircraft performance",
      "Separation procedures and traffic coordination",
      "Simulation, human factors and emergency handling",
    ],
    trainingRoutes: [
      {
        title: "Air Traffic Management / Air Traffic Services training",
        institution: "East African School of Aviation",
        url: "https://www.easa.ac.ke",
        entryRequirements: [
          "Confirm the current intake, employer nomination or recruitment route with EASA and KCAA.",
          "Ask for the specific academic, aptitude and medical criteria; there is no single college-grade rule for every ATC course.",
        ],
        qualification:
          "Approved training towards the relevant air traffic control rating; a course certificate is not an unrestricted controller licence.",
        duration: "Varies by rating, course stage and supervised experience.",
      },
    ],
    requirements: [
      "KCAA licence issue requires age 21 or above and a current Class 3 medical certificate.",
      "Complete approved training and the required supervised control experience; KCAA’s published guidance specifies at least three months of satisfactory OJT.",
      "Meet English proficiency and the assessment requirements for at least one controller rating. Unit validation and continuing competence also matter.",
    ],
    opportunities: [
      "Aerodrome control after the relevant rating",
      "Approach or area control with further ratings",
      "Air traffic services coordination",
      "Instruction, supervision or safety work after experience",
    ],
    growth:
      "Additional ratings and operational competence can support progression into supervision, instruction, procedure development or air traffic management.",
    sources: [
      {
        label: "KCAA: Air Traffic Controller licensing",
        url: "https://www.kcaa.or.ke/personnel-licencing/licencing/air-traffic-controllers-licences",
      },
      {
        label: "EASA: Admission guidance",
        url: "https://easa.ac.ke/faqs",
      },
    ],
  },
  {
    slug: "aeronautical-meteorologist",
    title: "Aviation Meteorologist",
    discipline: "safety-and-control",
    skills: [
      "Atmospheric physics and numerical model interpretation",
      "Pattern recognition from satellite and radar",
      "Communicating uncertainty precisely",
      "Data analysis and programming (increasingly essential)",
      "Composure when the answer must be given now",
    ],
    subjects: ["Mathematics", "Physics", "Geography", "Computer Studies"],
    motif: "weather",
    icon: "CloudSun",
    featured: false,
    hook: "Turn weather observations into information that helps aviation teams plan safely.",
    summary:
      "Explore meteorology studies and the additional competencies involved in aviation forecasting.",
    overview:
      "Meteorology is the study of the atmosphere. Aviation meteorologists focus on weather that affects flight, including visibility, cloud, wind, storms and turbulence. They interpret observations and forecasts so operational teams can understand changing conditions.\n\nA meteorology degree provides a scientific foundation. Aviation-specific preparation and assessed workplace competence are additional steps, and the job includes communication as well as analysis.",
    studyTopics: [
      "Atmospheric physics and dynamics",
      "Weather observations and instruments",
      "Forecasting methods and numerical models",
      "Satellite and radar interpretation",
      "Climate, statistics and scientific computing",
      "Aviation weather hazards and operational briefing",
    ],
    trainingRoutes: [
      {
        title: "Bachelor of Science in Meteorology",
        institution: "University of Nairobi",
        url: "https://earthclimatesciences.uonbi.ac.ke/admission-content-type/bachelor-science-meteorology",
        entryRequirements: [
          "Published KCSE route: mean C+, with C+ in Mathematics and Physics or Chemistry.",
          "The university also considers specified equivalent or diploma routes; ask admissions to assess your qualification.",
        ],
        qualification:
          "BSc Meteorology; aviation roles may require further operational training and competence assessment.",
        duration: "Confirm the current programme schedule with the university.",
      },
    ],
    requirements: [
      "Build a strong foundation in mathematics, science and data interpretation.",
      "Check the employer’s requirements for aviation forecasting or observation roles and any additional professional training.",
      "A meteorology degree is not a pilot licence or an air traffic controller qualification.",
    ],
    opportunities: [
      "Meteorological observation and forecasting",
      "Aviation weather support after specialist preparation",
      "Climate and environmental analysis",
      "Research, scientific computing and further study",
    ],
    growth:
      "Experience and specialist study can lead to senior forecasting, aviation meteorology supervision, research or climate-service roles.",
    sources: [
      {
        label: "University of Nairobi: BSc Meteorology",
        url: "https://earthclimatesciences.uonbi.ac.ke/admission-content-type/bachelor-science-meteorology",
      },
    ],
  },
  {
    slug: "airport-manager",
    title: "Airport Manager",
    discipline: "ground-operations",
    skills: [
      "Operations and safety management systems",
      "Stakeholder negotiation across agencies",
      "Commercial and budget literacy",
      "Crisis and incident command",
      "Regulatory compliance",
    ],
    subjects: ["Mathematics", "Business Studies", "Geography", "English"],
    motif: "tower",
    icon: "Building2",
    featured: false,
    hook: "Coordinate the people, facilities and services that keep an airport working.",
    summary: "Explore civil aviation management and airport operations studies in Kenya.",
    overview:
      "Airport management connects safety, service, facilities, finance and coordination with airlines and public agencies. An airport has many teams, and managers help them work together while meeting operational requirements.\n\nStudents usually begin with management or operations studies and gain experience in a specific airport function. Airport manager is generally a progression role rather than the first position obtained after graduation.",
    studyTopics: [
      "Airport and airline organisation",
      "Operations planning and service performance",
      "Business communication and financial management",
      "Safety, security and emergency planning",
      "Facilities, passenger services and stakeholder coordination",
      "Transport policy, regulation and aviation economics",
    ],
    trainingRoutes: [
      {
        title: "Bachelor of Civil Aviation Management",
        institution: "Moi University",
        url: "https://engineering.mu.ac.ke/index.php/masters-programmes/42-programmes/undergraduate",
        entryRequirements: [
          "Published KCSE route: mean C+, with C+ in Mathematics, English and a business-related subject.",
          "Recognised alternative qualifications are assessed by the university.",
        ],
        qualification: "Bachelor’s degree in Civil Aviation Management.",
        duration: "Confirm current study mode and intake with Moi University.",
      },
      {
        title: "Diploma in Airport Ground Operations Management",
        institution: "East African School of Aviation",
        url: "https://www.easa.ac.ke/node/671",
        entryRequirements: [
          "EASA’s general diploma baseline is KCSE C− or equivalent; confirm the exact course criteria.",
        ],
        qualification: "Diploma supporting entry into airport operations functions.",
        duration: "The current course listing states two years.",
      },
    ],
    requirements: [
      "Confirm whether your preferred route is a diploma, degree or a professional course requiring prior work experience.",
      "Operational access and employer-specific training are separate from academic admission.",
      "Management appointments typically require experience and demonstrated leadership in addition to a qualification.",
    ],
    opportunities: [
      "Airport operations assistant or officer",
      "Terminal and passenger-services coordination",
      "Commercial, customer-service or facilities functions",
      "Airport management after relevant experience",
    ],
    growth:
      "Specialist operations experience can lead to departmental supervision and broader airport or aviation-business management.",
    sources: [
      {
        label: "Moi University: Civil Aviation Management entry requirements",
        url: "https://engineering.mu.ac.ke/index.php/masters-programmes/42-programmes/undergraduate",
      },
      {
        label: "EASA: Airport Ground Operations Management",
        url: "https://www.easa.ac.ke/node/671",
      },
      {
        label: "EASA: Admission guidance",
        url: "https://easa.ac.ke/faqs",
      },
    ],
  },
  {
    slug: "flight-dispatcher",
    title: "Flight Dispatcher",
    discipline: "flight-operations",
    skills: [
      "Applied performance and fuel calculation",
      "Weather and NOTAM interpretation",
      "Fast, structured problem-solving",
      "Clear written and radio communication",
      "Working accurately at speed",
    ],
    subjects: ["Mathematics", "Physics", "Geography", "English"],
    motif: "navigation",
    icon: "Route",
    featured: false,
    hook: "Plan flights with the crew and monitor changing operational conditions.",
    summary:
      "Explore flight operations and dispatch training, then the KCAA licensing requirements.",
    overview:
      "Dispatchers bring together route information, weather, aircraft performance and operational restrictions to support flight planning. They also follow flights and communicate changes that may affect the journey.\n\nA dispatch course develops the technical knowledge needed for this work. The Kenyan professional licence also involves the applicable experience and assessments; a diploma by itself does not confer all dispatch privileges.",
    studyTopics: [
      "Flight planning and navigation",
      "Weather interpretation and operational hazards",
      "Aircraft performance and mass-and-balance principles",
      "Fuel planning, alternates and limitations",
      "Air law, operational documents and communication",
      "Flight following, disruption handling and human factors",
    ],
    trainingRoutes: [
      {
        title: "Diploma in Flight Operations / Dispatch",
        institution: "East African School of Aviation",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
        entryRequirements: [
          "Confirm the programme’s current academic requirements and selection process.",
          "Mathematics, English, Geography and computer skills provide useful preparation.",
        ],
        qualification:
          "Diploma in Flight Operations / Dispatch; KCAA Flight Operations Officer licensing is separate.",
        duration: "The published programme catalogue lists one year.",
      },
    ],
    requirements: [
      "KCAA licence issue requires age 21 or above, approved training and English-language competence.",
      "Meet the applicable knowledge, practical and experience requirements. The approved-training route includes supervised operational experience.",
      "Obtain written confirmation of how the course supports licensing and how the required workplace experience is arranged.",
    ],
    opportunities: [
      "Flight operations assistant",
      "Licensed flight dispatcher after qualification",
      "Flight-following and briefing roles",
      "Operations planning and control-centre work",
    ],
    growth:
      "Operational experience can lead to senior dispatch, training, standards or operations-control supervision.",
    sources: [
      {
        label: "KCAA: Flight Operations Officer licensing",
        url: "https://www.kcaa.or.ke/personnel-licencing/licencing/flight-operation-officer",
      },
      {
        label: "EASA: Published programme catalogue",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
      },
    ],
  },
  {
    slug: "aviation-security-officer",
    title: "Aviation Security Officer",
    discipline: "safety-and-control",
    skills: [
      "Sustained vigilance and attention to detail",
      "Behavioural observation",
      "Regulatory knowledge and audit discipline",
      "De-escalation and professional authority",
      "Integrity beyond question",
    ],
    subjects: ["English", "Kiswahili", "Business Studies", "Computer Studies"],
    motif: "instruments",
    icon: "ShieldCheck",
    featured: false,
    hook: "Protect passengers, staff and aviation operations through security procedures.",
    summary:
      "Explore aviation security training and the specific certification route for screeners.",
    overview:
      "Aviation security aims to prevent unlawful interference with civil aviation. Work can include screening, access control, patrols, reporting and coordination with airport or airline teams. Staff need careful observation and respectful communication.\n\nBasic aviation-security awareness, specialist screener training and instructor development are different courses. The qualification needed depends on the actual duty; a short awareness course does not authorise every security function.",
    studyTopics: [
      "Aviation security responsibilities and procedures",
      "Access control and identity checks",
      "Passenger, baggage and cargo-security principles",
      "Recognition and reporting of suspicious situations",
      "Communication and incident response",
      "Human factors and security equipment procedures",
    ],
    trainingRoutes: [
      {
        title: "Basic Aviation Security and specialist screener training",
        institution: "East African School of Aviation",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
        entryRequirements: [
          "Ask whether the course is for new entrants, nominated employees or experienced personnel.",
          "For screener certification, KCAA specifies KCSE C− or an equivalent recognised secondary-school qualification.",
        ],
        qualification:
          "Course certification appropriate to its scope; regulated screening duties require the KCAA certification process.",
        duration: "Varies by basic, specialist and recurrent course.",
      },
    ],
    requirements: [
      "For screeners, KCAA requires recognised initial training and OJT records for first certification.",
      "Employer background checks, a valid police-clearance certificate and relevant medical/physical assessments form part of the process.",
      "The employer applies for certification on the candidate’s behalf. Recurrent training and recertification requirements continue after entry.",
    ],
    opportunities: [
      "Airport access-control and security roles",
      "Certified passenger or baggage screening",
      "Cargo and mail security with specialist preparation",
      "Security supervision or instruction after further qualification",
    ],
    growth:
      "With operational experience and additional training, progression can include supervision, compliance or certified instructional work.",
    sources: [
      {
        label: "KCAA: Aviation security personnel certification",
        url: "https://www.kcaa.or.ke/safety-security-oversight/aviation-security/certification-of-aviation-security-personnel",
      },
      {
        label: "EASA: Published programme catalogue",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
      },
    ],
  },
  {
    slug: "airline-operations-controller",
    title: "Airline Operations Controller",
    discipline: "ground-operations",
    skills: [
      "Systems thinking and cascade modelling",
      "Fast triage and prioritisation",
      "Commercial judgement",
      "Cross-team coordination under pressure",
      "Composure during irregular operations",
    ],
    subjects: ["Mathematics", "Business Studies", "Geography", "Computer Studies"],
    motif: "instruments",
    icon: "Activity",
    featured: false,
    hook: "Keep aircraft, crews and schedules coordinated when plans change.",
    summary:
      "Explore operations and management studies that support airline control-centre careers.",
    overview:
      "An airline operations control centre coordinates the daily flying programme. Controllers work with dispatch, crew scheduling, maintenance and airport teams when weather, aircraft availability or other disruptions affect the schedule.\n\nThis is a coordination role with several possible educational routes. Dispatch studies develop flight-planning knowledge; aviation management develops broader organisational understanding. Employers provide additional procedures and systems training for their operation.",
    studyTopics: [
      "Airline schedules and operational coordination",
      "Disruption response and recovery planning",
      "Aircraft availability and maintenance liaison",
      "Crew, airport and passenger-service coordination",
      "Operational communication and record keeping",
      "Safety decisions and performance monitoring",
    ],
    trainingRoutes: [
      {
        title: "Flight Operations / Dispatch diploma route",
        institution: "East African School of Aviation",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
        entryRequirements: [
          "Confirm course-specific entry requirements and any work-experience expectations.",
        ],
        qualification:
          "A flight operations qualification; dispatch duties require the relevant licence.",
        duration: "The published diploma programme is one year.",
      },
      {
        title: "Bachelor of Civil Aviation Management",
        institution: "Moi University",
        url: "https://engineering.mu.ac.ke/index.php/masters-programmes/42-programmes/undergraduate",
        entryRequirements: [
          "Published KCSE route: C+ mean and C+ in Mathematics, English and a business-related subject.",
        ],
        qualification:
          "A management degree supporting wider airline business and operations roles.",
        duration: "Confirm the current programme schedule.",
      },
    ],
    requirements: [
      "Meet the chosen institution’s admission requirements and the employer’s experience criteria.",
      "An operations-controller title does not itself create a distinct pilot or dispatcher licence.",
      "Where duties include licensed flight dispatch, meet KCAA Flight Operations Officer requirements in addition to employer training.",
    ],
    opportunities: [
      "Operations-control assistant",
      "Crew or aircraft scheduling support",
      "Flight-following and network operations",
      "Operations-control supervision after experience",
    ],
    growth:
      "Developing competence across dispatch, scheduling and disruption management can support senior control-centre or airline operations roles.",
    sources: [
      {
        label: "KCAA: Flight Operations Officer licensing",
        url: "https://www.kcaa.or.ke/personnel-licencing/licencing/flight-operation-officer",
      },
      {
        label: "Moi University: Civil Aviation Management entry requirements",
        url: "https://engineering.mu.ac.ke/index.php/masters-programmes/42-programmes/undergraduate",
      },
      {
        label: "EASA: Published programme catalogue",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
      },
    ],
  },
  {
    slug: "ground-handling-specialist",
    title: "Ground Handling Specialist",
    discipline: "ground-operations",
    skills: [
      "Weight and balance calculation",
      "Ramp safety discipline",
      "Dangerous goods regulations",
      "Team leadership at speed",
      "Working outdoors in all conditions",
    ],
    subjects: ["Mathematics", "Physics", "Business Studies", "English"],
    motif: "aircraft",
    icon: "Truck",
    featured: false,
    hook: "Help aircraft, passengers and baggage move safely between flights.",
    summary: "Explore ground operations, passenger services, cargo and ramp-training pathways.",
    overview:
      "Ground handling connects the aircraft with the airport. Teams coordinate boarding, baggage, cargo, turnaround tasks and the equipment used around a parked aircraft. Some roles work in the terminal; others work on the apron.\n\nA ground-operations course provides a broad foundation. Practical authorisation for specific equipment and airside duties comes through employer training, supervised practice and airport requirements.",
    studyTopics: [
      "Passenger services and turnaround coordination",
      "Baggage, cargo and mail handling",
      "Ramp safety and aircraft movement awareness",
      "Load documentation and communication",
      "Ground-support equipment and human factors",
      "Dangerous-goods awareness appropriate to the role",
    ],
    trainingRoutes: [
      {
        title: "Diploma in Airport Ground Operations Management",
        institution: "East African School of Aviation",
        url: "https://www.easa.ac.ke/node/671",
        entryRequirements: [
          "EASA’s general diploma entry guidance is KCSE C− or equivalent; confirm the specific intake requirements.",
          "Check attachment arrangements and which practical competencies the course assesses.",
        ],
        qualification: "Diploma in airport ground operations management.",
        duration: "The published course listing states two years.",
      },
      {
        title: "Air Cargo Management and role-specific dangerous-goods training",
        institution: "East African School of Aviation",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
        entryRequirements: [
          "Entry depends on whether the programme is an introductory diploma or specialist occupational training.",
        ],
        qualification:
          "A cargo-related qualification or task-specific training; not a blanket authorisation for all handling work.",
        duration: "Depends on the selected course.",
      },
    ],
    requirements: [
      "Complete the employer’s training and assessment for the duties and equipment assigned.",
      "Airport access permissions and airside-driving authorisations, where needed, are separate requirements.",
      "Dangerous-goods training must match the actual function and be kept current.",
    ],
    opportunities: [
      "Passenger-service and boarding roles",
      "Ramp and turnaround coordination",
      "Baggage and cargo-handling roles",
      "Load-control or supervisory work after specialist preparation",
    ],
    growth:
      "Experience and additional training can lead to team leadership, station coordination, training or airport operations management.",
    sources: [
      {
        label: "EASA: Airport Ground Operations Management",
        url: "https://www.easa.ac.ke/node/671",
      },
      {
        label: "EASA: Published programme catalogue",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
      },
      {
        label: "EASA: Admission guidance",
        url: "https://easa.ac.ke/faqs",
      },
    ],
  },
  {
    slug: "aircraft-designer",
    title: "Aircraft Designer",
    discipline: "engineering",
    skills: [
      "Aerodynamics and structural mechanics",
      "CAD, FEA and CFD tooling",
      "Materials science",
      "Certification literacy",
      "Rigorous technical documentation",
    ],
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Studies"],
    motif: "engineering",
    icon: "PencilRuler",
    featured: false,
    hook: "Use engineering and testing to turn an aircraft concept into a workable design.",
    summary:
      "Explore the engineering foundation behind aircraft structures, aerodynamics and design.",
    overview:
      "Aircraft design brings together aerodynamics, structures, propulsion, systems and manufacturing. Designers compare alternatives, calculate performance and test whether a proposed solution can meet its requirements.\n\nIn Kenya, a relevant engineering degree can provide the foundation. Aircraft design is a specialisation developed through projects, technical experience and often further study; it is not a standalone KCAA personnel licence.",
    studyTopics: [
      "Engineering mathematics and mechanics",
      "Aerodynamics and flight performance",
      "Structural analysis, materials and manufacturing",
      "Computer-aided design and technical drawing",
      "Propulsion and aircraft-system integration",
      "Testing, simulation and design documentation",
    ],
    trainingRoutes: [
      {
        title: "Bachelor of Engineering (Aeronautical Engineering)",
        institution: "Technical University of Kenya",
        url: "https://intake.tukenya.ac.ke/index.php?r=courseApplication/default/home&prog=117",
        entryRequirements: [
          "Published KCSE entry: mean C+ and C+ in Mathematics A, Physics, Chemistry and English/Kiswahili.",
          "Equivalent and progression routes require confirmation with the university.",
        ],
        qualification:
          "An engineering degree; aircraft-design expertise develops through projects, attachments and further specialisation.",
        duration:
          "The university publishes a five-year academic sequence; confirm the current intake schedule.",
      },
    ],
    requirements: [
      "Meet the university’s published science and language subject requirements.",
      "Develop a portfolio through design projects, modelling, analysis and supervised practical experience.",
      "Confirm current professional recognition of the exact degree with the relevant engineering bodies; do not equate a degree with a maintenance licence.",
    ],
    opportunities: [
      "Junior design or CAD support",
      "Structures, manufacturing or test support",
      "Unmanned-aircraft design projects",
      "Research and postgraduate engineering study",
    ],
    growth:
      "Specialisation and practical experience can lead to design responsibility, analysis, systems integration or technical project leadership. Opportunities may extend beyond aviation and beyond Kenya.",
    sources: [
      {
        label: "Technical University of Kenya: Aeronautical Engineering degree",
        url: "https://intake.tukenya.ac.ke/index.php?r=courseApplication/default/home&prog=117",
      },
    ],
  },
  {
    slug: "aerospace-engineer",
    title: "Aerospace Engineer",
    discipline: "engineering",
    skills: [
      "Applied mathematics and physics",
      "Systems engineering and requirements discipline",
      "Programming and numerical analysis",
      "Test design and data interpretation",
      "Technical writing that stands up to review",
    ],
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Studies"],
    motif: "world",
    icon: "Rocket",
    featured: true,
    hook: "Apply science to the aircraft and systems that operate in the air and beyond.",
    summary:
      "Explore an aeronautical engineering foundation and routes into broader aerospace specialisms.",
    overview:
      "Aerospace engineering applies mathematics and physical science to flight vehicles and their systems. Work can involve aerodynamics, propulsion, structures, control systems, testing or integration. Aeronautical engineering focuses on aircraft operating in the atmosphere.\n\nKenyan aeronautical programmes provide one foundation for this wider field. Space-focused roles may require additional specialisation or postgraduate study; a course title alone does not guarantee access to a particular aerospace job.",
    studyTopics: [
      "Fluid mechanics and aerodynamics",
      "Thermodynamics and propulsion",
      "Structures and engineering materials",
      "Dynamics, stability and control",
      "Numerical methods, simulation and systems integration",
      "Engineering experiments and research methods",
    ],
    trainingRoutes: [
      {
        title: "Bachelor of Engineering (Aeronautical Engineering)",
        institution: "Technical University of Kenya",
        url: "https://intake.tukenya.ac.ke/index.php?r=courseApplication/default/home&prog=117",
        entryRequirements: [
          "Published KCSE entry: mean C+ and C+ in Mathematics A, Physics, Chemistry and English/Kiswahili.",
          "Equivalent and progression routes require confirmation with the university.",
        ],
        qualification:
          "An engineering degree; broader aerospace specialisation develops through projects, attachments and further specialisation.",
        duration:
          "The university publishes a five-year academic sequence; confirm the current intake schedule.",
      },
    ],
    requirements: [
      "Meet the institution’s Mathematics, Physics, Chemistry and language requirements.",
      "Build analytical and programming skills alongside laboratory and project experience.",
      "Check professional recognition and the prerequisites for any intended postgraduate or specialised aerospace route.",
    ],
    opportunities: [
      "Engineering analysis and technical support",
      "Testing, simulation and systems work",
      "Manufacturing or unmanned-aircraft development",
      "Research and further study in specialist aerospace fields",
    ],
    growth:
      "Graduates may develop into specialist analysts, systems engineers, researchers or technical managers. Some specialist opportunities require relocation or further qualifications.",
    sources: [
      {
        label: "Technical University of Kenya: Aeronautical Engineering degree",
        url: "https://intake.tukenya.ac.ke/index.php?r=courseApplication/default/home&prog=117",
      },
    ],
  },
  {
    slug: "drone-pilot",
    title: "Drone Pilot (RPAS Operator)",
    discipline: "flight-operations",
    skills: [
      "Airspace and regulatory knowledge",
      "Mission planning and risk assessment",
      "Photogrammetry and GIS processing",
      "Equipment maintenance and battery discipline",
      "Client communication and pricing",
    ],
    subjects: ["Mathematics", "Physics", "Geography", "Computer Studies"],
    motif: "navigation",
    icon: "Send",
    featured: true,
    hook: "Operate unmanned aircraft and turn flight data into useful results.",
    summary:
      "Explore remote-pilot training, operating permissions and specialist drone applications.",
    overview:
      "Drone work combines safe flight planning with a purpose such as inspection, mapping or image capture. A capable remote pilot understands the aircraft, the operating environment and how to respond when conditions change.\n\nThe pilot’s licence, aircraft requirements and the organisation’s operating permissions are separate matters. Training should cover the intended aircraft and use case; owning a drone is not the same as being authorised for every operation.",
    studyTopics: [
      "Unmanned-aircraft systems and pre-flight checks",
      "Airspace, weather and flight planning",
      "Remote-pilot control and emergency procedures",
      "Navigation, batteries and payload management",
      "Safety, privacy and operational documentation",
      "Mapping, inspection or imaging workflows",
    ],
    trainingRoutes: [
      {
        title: "Remote Pilot Licence (RPL) training",
        institution: "KCAA-listed Unmanned Aircraft Systems Training Organisations",
        url: "https://www.kcaa.or.ke/safety-security-oversight/unmanned-aircraft-systems/uto",
        entryRequirements: [
          "KCAA’s published UAS standards specify age 18 or above, English-language ability and the applicable medical assessment.",
          "Confirm current entry, student-licence and aircraft-rating requirements with the approved provider.",
        ],
        qualification:
          "Remote Pilot Licence with the appropriate rating and continuing requirements.",
        duration:
          "Provider- and rating-specific; confirm theory, practical flying and assessment time.",
      },
    ],
    requirements: [
      "Choose a currently approved UAS training organisation and verify the scope of its approval.",
      "Hold the required licence, ratings and medical assessment for your duties.",
      "Commercial operating arrangements, aircraft registration and flight permissions must also meet applicable KCAA requirements; the RPL does not replace them.",
    ],
    opportunities: [
      "Aerial imaging and media production",
      "Inspection and survey support with relevant technical skills",
      "Agricultural or environmental data collection",
      "Unmanned-aircraft operations and project coordination",
    ],
    growth:
      "Combining flight competence with surveying, GIS, data analysis or industry expertise can support specialist services and supervisory roles.",
    sources: [
      {
        label: "KCAA: UAS Manual of Implementing Standards",
        url: "https://www.kcaa.or.ke/sites/default/files/docs/uas/Manual%20of%20Implementing%20Standards%20%28MIS%29.pdf",
      },
      {
        label: "KCAA: Approved unmanned aircraft training organisations",
        url: "https://www.kcaa.or.ke/safety-security-oversight/unmanned-aircraft-systems/uto",
      },
    ],
  },
  {
    slug: "avionics-technician",
    title: "Avionics Technician",
    discipline: "engineering",
    skills: [
      "Electronics and digital systems",
      "Schematic and wiring diagram interpretation",
      "Structured fault diagnosis",
      "Test equipment operation",
      "Meticulous record keeping",
    ],
    subjects: ["Mathematics", "Physics", "Computer Studies", "Pre-Technical Studies"],
    motif: "instruments",
    icon: "CircuitBoard",
    featured: false,
    hook: "Work with the electronics that help an aircraft navigate, communicate and operate.",
    summary:
      "Explore avionics studies, fault diagnosis and the licensing route for certifying work.",
    overview:
      "Avionics covers aircraft electronic systems, including communication, navigation, displays and associated wiring. Technicians use diagrams, test equipment and approved procedures to locate faults and verify that systems work correctly.\n\nTraining combines electronics with aircraft knowledge. The ability to certify maintenance depends on the relevant licensing and authorisation requirements, rather than on a diploma title alone.",
    studyTopics: [
      "Electrical principles and electronic components",
      "Digital systems and aircraft instruments",
      "Communication, navigation and surveillance equipment",
      "Wiring diagrams and diagnostic procedures",
      "Test equipment, inspection and functional checks",
      "Maintenance records, human factors and airworthiness",
    ],
    trainingRoutes: [
      {
        title: "Diploma in Aeronautical Engineering — Avionics",
        institution: "East African School of Aviation",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
        entryRequirements: [
          "Confirm the current programme’s Mathematics, Physics and English requirements with EASA.",
          "Ask how workshop learning, attachment and licence preparation are organised.",
        ],
        qualification:
          "Aeronautical engineering diploma with an avionics focus; licensing is a separate process.",
        duration: "The published diploma catalogue lists three years.",
      },
      {
        title: "Diploma in Technology (Aeronautical Engineering)",
        institution: "Technical University of Kenya",
        url: "https://intake.tukenya.ac.ke/index.php?r=courseApplication/default/home&prog=180",
        entryRequirements: [
          "Published KCSE entry: mean C, with C− in Mathematics A, Physics and English.",
          "Confirm availability of the intended electronics specialisation before applying.",
        ],
        qualification:
          "A broader aeronautical technology qualification; confirm the specialisation and award with the university.",
        duration: "The published sequence covers three academic years, excluding attachment.",
      },
    ],
    requirements: [
      "For certifying duties, meet KCAA AMEL knowledge, experience, skill and examination requirements for the relevant rating.",
      "KCAA AMEL eligibility includes age 18 or above and English-language competence.",
      "Verify the applicable Kenyan licence and rating route rather than assuming that foreign licence-category terminology applies automatically.",
    ],
    opportunities: [
      "Trainee avionics or electronics technician",
      "Aircraft wiring and component-workshop roles",
      "Navigation or communication system maintenance support",
      "Licensed certifying work after meeting the relevant requirements",
    ],
    growth:
      "Experience can support progression into licensed maintenance, fault-diagnosis specialisms, technical training, quality assurance or supervision.",
    sources: [
      {
        label: "EASA: Published programme catalogue",
        url: "https://easa.ac.ke/sites/default/files/downloads/SEPTEMBER%20INTAKE%202025%20%5BFinal%5D.pdf",
      },
      {
        label: "Technical University of Kenya: Aeronautical Engineering diploma",
        url: "https://intake.tukenya.ac.ke/index.php?r=courseApplication/default/home&prog=180",
      },
      {
        label: "KCAA: Aircraft Maintenance Engineer licensing",
        url: "https://www.kcaa.or.ke/personnel-licencing/licencing/aircraft-maintenance-engineers",
      },
    ],
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
