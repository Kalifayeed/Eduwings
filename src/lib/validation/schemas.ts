import { z } from "zod";

/**
 * Form contracts.
 *
 * Each schema is the single definition used by three consumers: the client form
 * (through `zodResolver`), the API route that receives the payload, and the
 * TypeScript types on both sides. A field cannot be validated on the client but
 * not the server — the most common way user input becomes a security problem.
 *
 * Messages are written to be shown directly to a visitor, so they are specific
 * and non-technical.
 *
 * Design constraint worth stating explicitly: these schemas never use `.default()`
 * or `z.coerce`. Both make a schema's input type differ from its output type,
 * which forces every `useForm` call to carry three generics and silently breaks
 * the resolver's inference. Defaults belong in the form's `defaultValues`, and
 * numeric inputs are registered with `valueAsNumber` so the value arrives as a
 * number on both the client and — through JSON — the server.
 */

/* ─────────────────────────────── Primitives ───────────────────────────── */

const name = z
  .string()
  .trim()
  .min(2, "Please enter your full name.")
  .max(100, "That name is longer than we can store.");

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "We need an email address to reply to you.")
  .email("That does not look like a valid email address.")
  .max(254, "That email address is too long.");

/**
 * Deliberately permissive. Kenyan numbers are written as 0799577753,
 * +254799577753 and 254 799 577 753 in the wild; rejecting valid formats to
 * enforce one style costs real submissions.
 */
const phone = z
  .string()
  .trim()
  .min(7, "Please enter a complete phone number.")
  .max(24, "That phone number is too long.")
  .regex(/^[+()\d\s-]+$/, "Please use digits, spaces, and + ( ) - only.");

const optionalPhone = z
  .union([phone, z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

const message = z
  .string()
  .trim()
  .min(20, "Please give us a little more detail — at least 20 characters.")
  .max(4000, "Please keep this under 4,000 characters.");

/**
 * Anti-spam honeypot.
 *
 * Rendered visually hidden and off the tab order. Humans never fill it; a large
 * share of automated submissions do. It costs nothing in accessibility or user
 * effort, unlike a CAPTCHA, and is checked server-side.
 */
const honeypot = z
  .string()
  .max(0, "This submission was rejected.")
  .optional()
  .or(z.literal("").optional());

const consent = z
  .boolean()
  .refine((value) => value, { message: "Please confirm before submitting." });

/* ────────────────────────────── Newsletter ────────────────────────────── */

export const newsletterSchema = z.object({
  email,
  name: z.string().trim().max(100).optional(),
  source: z.string().trim().min(1).max(40),
  website: honeypot,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

/* ─────────────────────────────── Contact ──────────────────────────────── */

export const CONTACT_TOPICS = [
  "A school visit",
  "Partnership or sponsorship",
  "Volunteering",
  "Media enquiry",
  "Careers guidance",
  "Something else",
] as const;

export const contactSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  topic: z.enum(CONTACT_TOPICS, { errorMap: () => ({ message: "Please choose a topic." }) }),
  message,
  website: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;

/* ────────────────────────────── Volunteer ─────────────────────────────── */

export const VOLUNTEER_ROLES = [
  "Pilot",
  "Cabin Crew",
  "Aircraft Engineer",
  "Air Traffic Controller",
  "Flight Dispatcher",
  "Airport Operations",
  "Aviation Security",
  "Meteorologist",
  "Aerospace Engineer",
  "Remote Pilot",
  "Other aviation role",
  "Not in aviation — I want to help another way",
] as const;

export const VOLUNTEER_AVAILABILITY = [
  "One or two days a year",
  "Two to four days a year",
  "Monthly",
  "As needed — call me",
] as const;

export const volunteerSchema = z.object({
  name,
  email,
  phone: phone,
  role: z.enum(VOLUNTEER_ROLES, {
    errorMap: () => ({ message: "Please tell us what you do." }),
  }),
  organisation: z.string().trim().max(120).optional(),
  yearsExperience: z
    .number()
    .int("Please enter a whole number of years.")
    .min(0, "That cannot be negative.")
    .max(60, "Please enter a realistic number of years."),
  availability: z.enum(VOLUNTEER_AVAILABILITY, {
    errorMap: () => ({ message: "Please choose your availability." }),
  }),
  county: z.string().trim().min(2, "Which county are you based in?").max(60),
  motivation: message,
  consent,
  website: honeypot,
});

export type VolunteerInput = z.infer<typeof volunteerSchema>;

/* ──────────────────────────── School request ──────────────────────────── */

export const SCHOOL_LEVELS = ["Primary", "Secondary", "Mixed", "International"] as const;

export const SCHOOL_TYPES = ["Public", "Private", "International"] as const;

export const PROGRAMMES_REQUESTED = [
  "Primary & Junior Level Modules",
  "Secondary & Senior Level Modules",
  "Field Trip After Modules (Host Simulator Facility)",
  "Aviation Career Awareness Talk",
  "Careers & Career Guidance",
  "Aviation STEM Awareness",
  "Aviation Demonstration",
  "Aviation Professional Talk",
  "Student Exposure Session",
  "Other",
] as const;

export const schoolRequestSchema = z.object({
  schoolName: z.string().trim().min(3, "Please enter the school's full name.").max(150),
  schoolType: z.enum(SCHOOL_TYPES, {
    errorMap: () => ({ message: "Please choose a school type." }),
  }),
  level: z.enum(SCHOOL_LEVELS, { errorMap: () => ({ message: "Please choose a level." }) }),
  county: z.string().trim().min(2, "Which county is the school in?").max(60),
  town: z.string().trim().max(80).optional(),
  address: z.string().trim().min(5, "Please give us a physical address or landmark.").max(200),
  schoolWebsite: z
    .union([z.string().trim().url("Please enter a full URL, e.g. https://..."), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  contactName: name,
  role: z.string().trim().min(2, "What is your role at the school?").max(80),
  email,
  phone,
  studentCount: z
    .number()
    .int("Please enter a whole number.")
    .min(10, "We need at least 10 students to make the visit worthwhile.")
    .max(3000, "Please enter a realistic number of students."),
  targetGrades: z.string().trim().min(2, "Which grades or forms should we plan for?").max(120),
  teacherCount: z
    .number()
    .int("Please enter a whole number.")
    .min(1, "At least one accompanying teacher is required.")
    .max(50, "Please enter a realistic number of teachers."),
  programmesRequested: z
    .array(z.enum(PROGRAMMES_REQUESTED))
    .min(1, "Please choose at least one programme."),
  preferredDate: z.string().trim().min(1, "Please give us a preferred date."),
  alternativeDate: z.string().trim().max(60).optional(),
  preferredTime: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(2000, "Please keep this under 2,000 characters.").optional(),
  consent,
  website: honeypot,
});

export type SchoolRequestInput = z.infer<typeof schoolRequestSchema>;

/* ────────────────────────────── Aviation visit ─────────────────────────── */

export const VISIT_SCHOOL_TYPES = ["Public", "Private", "International"] as const;

export const VISIT_SCHOOL_LEVELS = ["Primary", "Secondary", "Mixed", "International"] as const;

export const VISIT_DESTINATION_TYPES = [
  "Airport",
  "Airstrip",
  "Aviation College or Training Institution",
  "Airline or MRO facility",
  "Other",
  "Not sure — advise us",
] as const;

export const VISIT_PURPOSES = [
  "Career exposure for students",
  "STEM / curriculum enrichment",
  "Simulator facility visit after the modules",
  "Meet working aviation professionals",
  "Site / facility tour",
  "Other",
] as const;

export const aviationVisitSchema = z.object({
  schoolName: z.string().trim().min(3, "Please enter the school's full name.").max(150),
  schoolType: z.enum(VISIT_SCHOOL_TYPES, {
    errorMap: () => ({ message: "Please choose a school type." }),
  }),
  level: z.enum(VISIT_SCHOOL_LEVELS, { errorMap: () => ({ message: "Please choose a level." }) }),
  county: z.string().trim().min(2, "Which county is the school in?").max(60),
  town: z.string().trim().max(80).optional(),
  contactName: name,
  role: z.string().trim().min(2, "What is your role at the school?").max(80),
  email,
  phone,
  destinationType: z.enum(VISIT_DESTINATION_TYPES, {
    errorMap: () => ({ message: "Please tell us what kind of destination you have in mind." }),
  }),
  purposes: z
    .array(z.enum(VISIT_PURPOSES))
    .min(1, "Please choose at least one purpose for the visit."),
  studentCount: z
    .number()
    .int("Please enter a whole number.")
    .min(5, "We need at least 5 students to plan a visit.")
    .max(500, "For groups over 500 please contact us directly."),
  teacherCount: z
    .number()
    .int("Please enter a whole number.")
    .min(1, "At least one accompanying teacher is required.")
    .max(50, "Please enter a realistic number of teachers."),
  preferredDate: z.string().trim().min(1, "Please give us a preferred date."),
  alternativeDate: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(2000, "Please keep this under 2,000 characters.").optional(),
  consent,
  website: honeypot,
});

export type AviationVisitInput = z.infer<typeof aviationVisitSchema>;

/* ───────────────────────────── Partnership ────────────────────────────── */

export const PARTNERSHIP_TYPES = [
  "Sponsor school visits",
  "Open our facility to students",
  "Release staff as volunteers",
  "Provide equipment or materials",
  "Something else",
] as const;

export const partnershipSchema = z.object({
  organisation: z.string().trim().min(2, "Please enter your organisation's name.").max(150),
  contactName: name,
  role: z.string().trim().min(2, "What is your role?").max(80),
  email,
  phone: optionalPhone,
  type: z.enum(PARTNERSHIP_TYPES, {
    errorMap: () => ({ message: "Please choose how you would like to help." }),
  }),
  message,
  website: honeypot,
});

export type PartnershipInput = z.infer<typeof partnershipSchema>;

/* ────────────────────────────── Donation ──────────────────────────────── */

export const DONATION_FREQUENCIES = ["One-off", "Monthly", "Termly", "Annually"] as const;

export const donationSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  amountKes: z
    .number()
    .int("Please enter a whole amount in shillings.")
    .min(500, "The minimum we can process is KES 500.")
    .max(50_000_000, "Please contact us directly for gifts of this size."),
  frequency: z.enum(DONATION_FREQUENCIES, {
    errorMap: () => ({ message: "Please choose how often you would like to give." }),
  }),
  designation: z.string().trim().max(120).optional(),
  isOrganisation: z.boolean(),
  organisation: z.string().trim().max(150).optional(),
  note: z.string().trim().max(1000).optional(),
  website: honeypot,
});

export type DonationInput = z.infer<typeof donationSchema>;

/* ──────────────────────── Event registration ──────────────────────────── */

export const eventRegistrationSchema = z.object({
  eventSlug: z.string().trim().min(1).max(120),
  name,
  email,
  phone,
  organisation: z.string().trim().min(2, "Which school or organisation are you with?").max(150),
  attendees: z
    .number()
    .int("Please enter a whole number.")
    .min(1, "At least one attendee is required.")
    .max(60, "For groups over 60 please contact us directly."),
  notes: z.string().trim().max(1000).optional(),
  consent,
  website: honeypot,
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
