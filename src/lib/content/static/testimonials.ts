import type { Testimonial } from "@/lib/content/types";
import { published } from "@/lib/content/static/seed-utils";

/** Seed testimonials. Names and schools are illustrative until consent is on file. */
const seed = [
  {
    id: "tst-head-teacher-machakos",
    quote:
      "I have sat through many careers talks. This was the first where students left holding a piece of paper with their own subjects on it and a specific thing to do about them. Two of my Form Threes changed their subject combination the following week.",
    authorName: "Grace Wanjiru",
    authorRole: "Head Teacher",
    organisation: "Kyeleni Secondary School",
    locality: "Machakos",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "tst-student-avionics",
    quote:
      "I always liked taking things apart but I thought that meant being a mechanic. Nobody had told me an aircraft has an electrical licence attached to it. I am eighteen months into the diploma now.",
    authorName: "Amina Hassan",
    authorRole: "Student",
    organisation: "Aeronautical Engineering Diploma, Year 2",
    locality: "Nairobi",
    featured: true,
    sortOrder: 2,
  },
  {
    id: "tst-physics-teacher",
    quote:
      "The effect on my Physics class lasted a full term. They kept referring back to the wing they built. I have taught forces for eleven years and I have never had students argue about angle of attack unprompted.",
    authorName: "Peter Otieno",
    authorRole: "Teacher",
    organisation: "St. Mary's Secondary School",
    locality: "Kisumu",
    featured: true,
    sortOrder: 3,
  },
  {
    id: "tst-parent",
    quote:
      "My daughter came home talking about becoming a pilot and I was worried about the cost. The parents' session was honest about it — and it introduced me to three careers I had never heard of that we can actually afford.",
    authorName: "Susan Kamau",
    authorRole: "Parent",
    organisation: "Parent of a Form Two student",
    locality: "Nakuru",
    featured: true,
    sortOrder: 4,
  },
  {
    id: "tst-student-dispatcher",
    quote:
      "I did the turnaround exercise and I was the dispatcher. We failed the first time and I was annoyed about it for days. That is why I looked up the licence. I start the course in January.",
    authorName: "Brian Mutiso",
    authorRole: "Student",
    organisation: "Form Four leaver",
    locality: "Machakos",
    featured: false,
    sortOrder: 5,
  },
  {
    id: "tst-partner-engineer",
    quote:
      "I volunteered expecting to give a talk. What actually happened was ninety minutes of the sharpest questions I have been asked in years, including two I had to go away and check. I have been back four times.",
    authorName: "Dennis Kiprop",
    authorRole: "Partner",
    organisation: "Licensed B1 Engineer, volunteer session leader",
    locality: "Nairobi",
    featured: true,
    sortOrder: 6,
  },
  {
    id: "tst-head-teacher-kisumu",
    quote:
      "What convinced me was that they came to us. We are four hours from the nearest airport and no industry programme had ever made that journey before.",
    authorName: "Margaret Achieng",
    authorRole: "Head Teacher",
    organisation: "Nyakach Girls' High School",
    locality: "Kisumu",
    featured: false,
    sortOrder: 7,
  },
  {
    id: "tst-student-drone",
    quote:
      "They said the drone thing was a real aviation licence and I did not believe them. I have the licence now and I map farms at weekends. I am nineteen.",
    authorName: "Kevin Njoroge",
    authorRole: "Student",
    organisation: "Licensed remote pilot",
    locality: "Nyeri",
    featured: false,
    sortOrder: 8,
  },
] as const;

export const testimonials: Testimonial[] = seed.map((item) => ({
  ...item,
  avatarUrl: null,
  ...published(),
}));
