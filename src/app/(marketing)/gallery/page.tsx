import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Gallery", href: routes.gallery },
];

export const metadata = buildMetadata({
  title: "Gallery",
  description:
    "Photographs and film from EduWings school visits, airport tours, workshops and events across Kenya.",
  path: routes.gallery,
});

export default async function GalleryPage() {
  const { items } = await getContentSource().gallery.list();

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Gallery"
        title="What it actually looks like."
        description="Classrooms, hangars, control towers and the moment a paper wing finally generates measurable lift. Photographs and film from across the programme."
        breadcrumbs={BREADCRUMBS}
      />

      <Section>
        <div className="container-page">
          <GalleryGrid items={items} />
        </div>
      </Section>

      <Section size="sm">
        <CtaBand
          title="The next set of photographs could be from your school."
          description="We visit schools anywhere in Kenya, free of charge, and we always ask permission before publishing anything."
          primary={{ label: "Request a school visit", href: routes.schools }}
          secondary={{ label: "See upcoming events", href: routes.events }}
        />
      </Section>
    </>
  );
}
