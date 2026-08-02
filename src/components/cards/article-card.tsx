import Link from "next/link";
import { Clock } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { routes } from "@/config/routes";
import type { Article } from "@/lib/content/types";
import { Badge } from "@/components/ui/badge";
import { AppImage } from "@/components/media/app-image";

interface ArticleCardProps {
  article: Article;
  /** `feature` gives the lead story a wider, image-forward treatment. */
  variant?: "default" | "feature" | "compact";
  className?: string;
}

function ArticleCard({ article, variant = "default", className }: ArticleCardProps) {
  const href = routes.article(article.slug);

  if (variant === "compact") {
    return (
      <article className={cn("group relative flex gap-4 py-4", className)}>
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
          <AppImage
            src={article.coverImage}
            alt=""
            seed={article.slug}
            motif="learning"
            className="size-full"
          />
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-display text-sm leading-snug font-semibold transition-colors group-hover:text-primary">
            <Link href={href} className="before:absolute before:inset-0">
              {article.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {formatDate(article.publishedAt ?? article.createdAt, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {article.readingMinutes} min read
          </p>
        </div>
      </article>
    );
  }

  const isFeature = variant === "feature";

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border bg-card",
        "shadow-[var(--shadow-soft)] transition-all duration-300 ease-[var(--ease-out-expo)]",
        "focus-within:-translate-y-1 hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
        isFeature ? "flex-col lg:flex-row" : "flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isFeature ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/9]",
        )}
      >
        <AppImage
          src={article.coverImage}
          alt=""
          seed={article.slug}
          motif="learning"
          sizes={isFeature ? "(min-width: 1024px) 40rem, 100vw" : "(min-width: 768px) 24rem, 100vw"}
          className="size-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      </div>

      <div className={cn("flex flex-1 flex-col p-6", isFeature && "lg:p-8")}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{article.category}</Badge>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock aria-hidden className="size-3.5" />
            {article.readingMinutes} min read
          </span>
        </div>

        <h3
          className={cn(
            "mt-4 font-display leading-tight font-semibold tracking-tight transition-colors group-hover:text-primary",
            isFeature ? "text-2xl lg:text-3xl" : "text-lg",
          )}
        >
          <Link href={href} className="before:absolute before:inset-0">
            {article.title}
          </Link>
        </h3>

        <p
          className={cn(
            "mt-3 flex-1 leading-relaxed text-muted-foreground",
            isFeature ? "text-base" : "line-clamp-3 text-sm",
          )}
        >
          {article.excerpt}
        </p>

        <p className="mt-6 border-t pt-4 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{article.authorName}</span>
          {" · "}
          {formatDate(article.publishedAt ?? article.createdAt)}
        </p>
      </div>
    </article>
  );
}

export { ArticleCard };
