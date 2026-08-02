import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { routes } from "@/config/routes";
import { getContentSource } from "@/lib/content";
import { formatDate, initialsOf } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarkdownContent } from "@/components/content/markdown";
import { AppImage } from "@/components/media/app-image";
import { ArticleCard } from "@/components/cards/article-card";
import { ShareRow } from "@/components/content/share-row";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Prerender every published article at build time. When Supabase is the active
 * source this reads from the database during the build; `dynamicParams` (the
 * default) still allows articles published afterwards to render on demand.
 */
export async function generateStaticParams() {
  const slugs = await getContentSource().articles.slugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getContentSource().articles.bySlug(slug);

  if (!article) {
    return buildMetadata({
      title: "Article not found",
      description: "This article could not be found.",
      path: routes.article(slug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: routes.article(article.slug),
    type: "article",
    publishedTime: article.publishedAt ?? undefined,
    modifiedTime: article.updatedAt,
    authors: [article.authorName],
    keywords: article.tags,
    image: article.coverImage ?? undefined,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const source = getContentSource();
  const article = await source.articles.bySlug(slug);

  if (!article) notFound();

  const related = await source.articles.list({
    category: article.category,
    excludeSlug: article.slug,
    limit: 3,
  });

  const breadcrumbs = [
    { label: "Home", href: routes.home },
    { label: "News", href: routes.news },
    { label: article.title, href: routes.article(article.slug) },
  ];

  const publishedAt = article.publishedAt ?? article.createdAt;

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(breadcrumbs),
          articleSchema({
            title: article.title,
            description: article.excerpt,
            path: routes.article(article.slug),
            publishedAt,
            updatedAt: article.updatedAt,
            authorName: article.authorName,
            image: article.coverImage,
          }),
        )}
      />

      <article>
        <div className="relative overflow-hidden border-b bg-aurora">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

          <div className="relative container-page pt-10 pb-14">
            <Breadcrumb items={breadcrumbs} className="mb-8" />

            <Reveal className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{article.category}</Badge>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock aria-hidden className="size-3.5" />
                  {article.readingMinutes} min read
                </span>
              </div>

              <h1 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 font-display font-semibold text-primary">
                      {initialsOf(article.authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{article.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {article.authorRole ? `${article.authorRole} · ` : ""}
                      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                    </p>
                  </div>
                </div>

                <ShareRow title={article.title} path={routes.article(article.slug)} />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="container-page py-14">
          <Reveal className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl shadow-[var(--shadow-float)]">
            <AppImage
              src={article.coverImage}
              alt=""
              seed={article.slug}
              motif="learning"
              priority
              sizes="(min-width: 1024px) 56rem, 100vw"
              className="size-full"
            />
          </Reveal>

          <div className="container-prose mt-14 px-0">
            <MarkdownContent content={article.body} />

            {article.tags.length > 0 ? (
              <ul className="mt-12 flex flex-wrap gap-2 border-t pt-8">
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="muted">#{tag}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <Button asChild variant="ghost">
                <Link href={routes.news}>
                  <ArrowLeft className="size-4" />
                  All articles
                </Link>
              </Button>
              <ShareRow title={article.title} path={routes.article(article.slug)} />
            </div>
          </div>
        </div>
      </article>

      {related.items.length > 0 ? (
        <Section tone="surface">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              More in {article.category}
            </h2>
            <RevealGroup as="ul" className="mt-10 grid gap-6 md:grid-cols-3">
              {related.items.map((item) => (
                <RevealItem as="li" key={item.id}>
                  <ArticleCard article={item} className="h-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      <Section size="sm">
        <CtaBand
          title="Reading about it is not the same as being in the room."
          description="We deliver this in classrooms across Kenya, free to schools."
          primary={{ label: "Request a school visit", href: routes.schools }}
          secondary={{ label: "Explore the careers", href: routes.careers }}
        />
      </Section>
    </>
  );
}
