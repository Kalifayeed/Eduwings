import { siteUrl } from "@/lib/env";

/**
 * Single source of truth for organisation-level facts.
 *
 * Anything that appears in more than one place — the footer, structured data,
 * email templates, OpenGraph tags, the contact page — reads from here so the
 * organisation can be rebranded or relocated by editing one file.
 */
export const siteConfig = {
  name: "EduWings",
  legalName: "EduWings Aviation Awareness Programme",
  tagline: "Inspiring the Next Generation of Aviation Professionals.",
  shortDescription:
    "An aviation awareness programme bringing the world of flight into primary and secondary school classrooms.",
  description:
    "EduWings introduces primary and secondary school students to the world of aviation — the science of flight, how airports work, and the careers that keep the industry moving. We visit schools, run hands-on workshops, and connect students with the professionals who fly, build, guide and manage aircraft.",
  url: siteUrl,
  locale: "en_KE",
  language: "en",
  foundingYear: 2023,

  founder: {
    name: "Meldah Magova",
    image: "/images/meldah-magova-founder-22397d33c69a.jpg",
    role: "Founder — EduWings",
    phone: "0799577753",
    /** E.164, for `tel:` links and structured data. Kenya country code +254. */
    phoneE164: "+254799577753",
    bio: "Eduwings was founded by Meldah Magova to address a gap she had seen firsthand: many young learners discover aviation careers only when they are finishing secondary school and have already begun making decisions about their future.",
  },

  contact: {
    email: "hello@eduwings.org",
    partnershipsEmail: "partners@eduwings.org",
    schoolsEmail: "schools@eduwings.org",
    phone: "0799577753",
    phoneE164: "+254799577753",
    address: {
      street: "Aviation House, Airport North Road",
      locality: "Nairobi",
      region: "Nairobi County",
      postalCode: "00100",
      country: "Kenya",
      countryCode: "KE",
    },
    /** Placeholder embed — swap the `q` parameter for the real premises. */
    mapEmbedUrl:
      "https://www.google.com/maps?q=Jomo+Kenyatta+International+Airport,+Nairobi&output=embed",
    mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Nairobi%2C+Kenya",
    officeHours: "Monday to Friday, 08:00 – 17:00 EAT",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com/eduwings", handle: "@eduwings" },
    { label: "LinkedIn", href: "https://linkedin.com/company/eduwings", handle: "EduWings" },
    { label: "X", href: "https://x.com/eduwings", handle: "@eduwings" },
    { label: "Facebook", href: "https://facebook.com/eduwings", handle: "EduWings" },
    { label: "YouTube", href: "https://youtube.com/@eduwings", handle: "@eduwings" },
  ],

  /** Used by Twitter card metadata. */
  twitterHandle: "@eduwings",

  keywords: [
    "aviation education",
    "aviation careers",
    "STEM education Kenya",
    "school aviation programme",
    "pilot career",
    "aerospace engineering",
    "air traffic control",
    "aviation awareness",
    "career guidance",
    "EduWings",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
