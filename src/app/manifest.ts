import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** Web app manifest — required for the Lighthouse installability checks. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0a1424",
    theme_color: "#0a1424",
    lang: siteConfig.language,
    categories: ["education"],
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
