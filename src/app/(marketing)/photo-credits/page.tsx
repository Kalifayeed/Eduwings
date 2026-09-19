import { routes } from "@/config/routes";
import { careers } from "@/lib/content/careers";
import { getCareerPhoto } from "@/lib/content/career-photos";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { AppImage } from "@/components/media/app-image";

export const metadata = buildMetadata({
  title: "Photography credits",
  description:
    "Sources, photographers and licences for the illustrative aviation photographs used in our career catalogues.",
  path: routes.photoCredits,
});
export default function PhotoCreditsPage() {
  return (
    <>
      <PageHero
        eyebrow="Photography credits"
        title="A closer look at the world of aviation."
        description="These freely licensed photographs illustrate aviation roles and environments around the world. They do not represent EduWings staff, school visits or institutional partnerships. Images, people and organisations shown do not endorse EduWings."
        breadcrumbs={[
          { label: "Home", href: routes.home },
          { label: "Photography credits", href: routes.photoCredits },
        ]}
      />
      <Section>
        <div className="container-page grid gap-8 md:grid-cols-2">
          {careers.map((career) => {
            const photo = getCareerPhoto(career.slug);
            return (
              <article
                key={career.slug}
                id={career.slug}
                className="scroll-mt-28 overflow-hidden rounded-2xl border bg-card"
              >
                <AppImage
                  src={photo.src}
                  alt={photo.alt}
                  seed={career.slug}
                  className="aspect-[16/9]"
                />
                <div className="p-6">
                  <h2 className="font-display text-xl font-semibold">{career.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed break-words text-muted-foreground">
                    {photo.title}
                  </p>
                  <p className="mt-3 text-sm">Photographer / source credit: {photo.author}</p>
                  <p className="mt-2 text-sm">
                    <a
                      className="text-primary underline"
                      href={photo.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Original image and attribution record
                    </a>
                  </p>
                  <p className="mt-2 text-sm">
                    <a
                      className="text-primary underline"
                      href={photo.licenseUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {photo.license}
                    </a>
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {photo.changes} Share-alike images remain available under the licence linked
                    above.
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
