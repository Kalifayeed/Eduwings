import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { siteUrl } from "@/lib/env";
import { truncate } from "@/lib/utils";

/** Optimal upper bound for a description that Google will not truncate. */
const DESCRIPTION_LIMIT = 158;

export interface PageMetadataInput {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. `/careers/pilot`. */
  path: string;
  /** Absolute or root-relative OpenGraph image. Falls back to the generated one. */
  image?: string;
  keywords?: readonly string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: readonly string[];
  /** Keeps a page out of the index — used for previews and utility routes. */
  noIndex?: boolean;
}

/**
 * Builds a complete, consistent metadata object for a route.
 *
 * Centralising this guarantees that canonical URLs, OpenGraph, Twitter cards and
 * robots directives can never drift apart page to page — the most common source
 * of SEO regressions on a site this size.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();
  const trimmedDescription = truncate(description, DESCRIPTION_LIMIT);
  const ogImage = image ?? "/opengraph-image";

  return {
    title,
    description: trimmedDescription,
    keywords: keywords ? [...keywords] : [...siteConfig.keywords],
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      title,
      description: trimmedDescription,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors: authors ? [...authors] : undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description: trimmedDescription,
      images: [ogImage],
    },
  };
}
