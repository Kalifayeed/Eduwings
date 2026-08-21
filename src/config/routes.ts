/**
 * Canonical route table.
 *
 * Every internal link in the product resolves through this object rather than a
 * string literal, which means a URL can be changed in one place and the
 * TypeScript compiler will find every consumer. Dynamic routes are functions.
 */
export const routes = {
  home: "/",
  about: "/about",
  parents: "/for-parents",
  program: "/program",
  activities: "/activities",
  careers: "/careers",
  career: (slug: string) => `/careers/${slug}`,
  schools: "/schools",
  visit: "/visit",
  courses: "/courses",
  course: (slug: string) => `/courses/${slug}`,
  gallery: "/gallery",
  news: "/news",
  article: (slug: string) => `/news/${slug}`,
  events: "/events",
  event: (slug: string) => `/events/${slug}`,
  faq: "/faq",
  contact: "/contact",
  donate: "/donate",
  volunteer: "/volunteer",
  partners: "/partners",
  sponsors: "/sponsors",
  search: "/search",
  privacy: "/privacy",
  terms: "/terms",

  login: "/login",

  admin: {
    root: "/admin",
    articles: "/admin/articles",
    article: (id: string) => `/admin/articles/${id}`,
    newArticle: "/admin/articles/new",
    events: "/admin/events",
    event: (id: string) => `/admin/events/${id}`,
    newEvent: "/admin/events/new",
    gallery: "/admin/gallery",
    galleryItem: (id: string) => `/admin/gallery/${id}`,
    newGalleryItem: "/admin/gallery/new",
    partners: "/admin/partners",
    partner: (id: string) => `/admin/partners/${id}`,
    newPartner: "/admin/partners/new",
    testimonials: "/admin/testimonials",
    testimonial: (id: string) => `/admin/testimonials/${id}`,
    newTestimonial: "/admin/testimonials/new",
    schools: "/admin/schools",
    school: (id: string) => `/admin/schools/${id}`,
    programs: "/admin/programs",
    program: (id: string) => `/admin/programs/${id}`,
    newProgram: "/admin/programs/new",
    media: "/admin/media",
    subscribers: "/admin/subscribers",
    submissions: "/admin/submissions",
    users: "/admin/users",
    settings: "/admin/settings",
  },
} as const;

/** Routes that require an authenticated administrator. */
export const PROTECTED_PATH_PREFIX = "/admin";
