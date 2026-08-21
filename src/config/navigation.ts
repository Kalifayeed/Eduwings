import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  HandHeart,
  Handshake,
  HelpCircle,
  Images,
  Landmark,
  Mail,
  MapPinned,
  Navigation,
  Newspaper,
  Plane,
  School,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { routes } from "@/config/routes";

export interface NavLink {
  label: string;
  href: string;
  /** Shown in mega-menu panels and mobile drawers. */
  description?: string;
  icon?: LucideIcon;
}

export interface NavSection {
  label: string;
  /** Present when the top-level item is itself a destination. */
  href?: string;
  items: NavLink[];
  /** Optional promotional panel rendered alongside the link list. */
  feature?: {
    title: string;
    body: string;
    href: string;
    cta: string;
  };
}

/** Primary header navigation. Order is deliberate: learn → explore → act. */
export const mainNavigation: NavSection[] = [
  {
    label: "The Programme",
    href: routes.program,
    items: [
      {
        label: "Our Programme",
        href: routes.program,
        description: "The full curriculum, from the history of flight to career pathways.",
        icon: BookOpenCheck,
      },
      {
        label: "Activities",
        href: routes.activities,
        description: "Workshops, airport visits, model builds and flight simulator sessions.",
        icon: Sparkles,
      },
      {
        label: "For Schools",
        href: routes.schools,
        description: "How to bring EduWings to your classroom, and what to expect.",
        icon: School,
      },
      {
        label: "Aviation Visits",
        href: routes.visit,
        description: "Take your students to an airport, airstrip or training college.",
        icon: MapPinned,
      },
      {
        label: "Where to Train",
        href: routes.courses,
        description: "KCAA-approved institutions and the courses they actually offer.",
        icon: Landmark,
      },
    ],
    feature: {
      title: "Built for the Kenyan classroom",
      body: "Every module maps to CBC learning outcomes in Science, Mathematics and Pre-Technical Studies.",
      href: routes.schools,
      cta: "Request a school visit",
    },
  },
  {
    label: "Careers",
    href: routes.careers,
    items: [
      {
        label: "All Aviation Careers",
        href: routes.careers,
        description: "Fourteen career paths, mapped end to end from school subject to salary.",
        icon: Plane,
      },
      {
        label: "Flight Deck & Cabin",
        href: `${routes.careers}?discipline=flight-operations`,
        description: "Pilots, cabin crew and flight dispatchers.",
        icon: Navigation,
      },
      {
        label: "Engineering & Design",
        href: `${routes.careers}?discipline=engineering`,
        description: "Aircraft engineers, designers and aerospace specialists.",
        icon: Target,
      },
      {
        label: "Ground & Operations",
        href: `${routes.careers}?discipline=ground-operations`,
        description: "Air traffic control, airport management, security and handling.",
        icon: Landmark,
      },
    ],
    feature: {
      title: "You cannot become what you have never seen",
      body: "Each career page shows the exact subjects, grades and training route a Kenyan student needs.",
      href: routes.careers,
      cta: "Explore the pathways",
    },
  },
  {
    label: "Discover",
    items: [
      {
        label: "Gallery",
        href: routes.gallery,
        description: "Photographs and film from school visits, airports and workshops.",
        icon: Images,
      },
      {
        label: "News & Articles",
        href: routes.news,
        description: "Field notes, student stories and aviation explainers.",
        icon: Newspaper,
      },
      {
        label: "Events",
        href: routes.events,
        description: "Open days, career fairs and airport tours you can register for.",
        icon: CalendarDays,
      },
      {
        label: "FAQ",
        href: routes.faq,
        description: "Straight answers for teachers, parents and students.",
        icon: HelpCircle,
      },
    ],
  },
  {
    label: "About",
    href: routes.about,
    items: [
      {
        label: "About EduWings",
        href: routes.about,
        description: "Our story, mission, and the people behind the programme.",
        icon: GraduationCap,
      },
      {
        label: "For Parents",
        href: routes.parents,
        description: "Careers, subjects and honest answers about cost and stability.",
        icon: Users,
      },
      {
        label: "Partners",
        href: routes.partners,
        description: "The airlines, airports and institutions that open their doors to us.",
        icon: Handshake,
      },
      {
        label: "Sponsors",
        href: routes.sponsors,
        description: "Organisations funding classroom visits across the country.",
        icon: Landmark,
      },
    ],
  },
  {
    label: "Get Involved",
    items: [
      {
        label: "Volunteer",
        href: routes.volunteer,
        description: "Give a few hours. Change the trajectory of a classroom.",
        icon: Users,
      },
      {
        label: "Donate",
        href: routes.donate,
        description: "Fund a school visit, a simulator session or a full term.",
        icon: HandHeart,
      },
      {
        label: "Contact",
        href: routes.contact,
        description: "Talk to the team directly.",
        icon: Mail,
      },
    ],
    feature: {
      title: "KES 45,000 funds an entire school",
      body: "That is one full EduWings day for up to 300 students, materials included.",
      href: routes.donate,
      cta: "Sponsor a school",
    },
  },
];

export interface FooterColumn {
  label: string;
  items: { label: string; href: string }[];
}

export const footerNavigation: FooterColumn[] = [
  {
    label: "Programme",
    items: [
      { label: "Our Programme", href: routes.program },
      { label: "Activities", href: routes.activities },
      { label: "Aviation Careers", href: routes.careers },
      { label: "For Schools", href: routes.schools },
      { label: "Aviation Visits", href: routes.visit },
      { label: "Where to Train", href: routes.courses },
    ],
  },
  {
    label: "Discover",
    items: [
      { label: "Gallery", href: routes.gallery },
      { label: "News & Articles", href: routes.news },
      { label: "Events", href: routes.events },
      { label: "FAQ", href: routes.faq },
    ],
  },
  {
    label: "Organisation",
    items: [
      { label: "About Us", href: routes.about },
      { label: "For Parents", href: routes.parents },
      { label: "Partners", href: routes.partners },
      { label: "Sponsors", href: routes.sponsors },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    label: "Support Us",
    items: [
      { label: "Donate", href: routes.donate },
      { label: "Volunteer", href: routes.volunteer },
      { label: "Partner With Us", href: routes.partners },
      { label: "Sponsor a School", href: routes.sponsors },
    ],
  },
];

export const legalNavigation = [
  { label: "Privacy Policy", href: routes.privacy },
  { label: "Terms of Use", href: routes.terms },
];
