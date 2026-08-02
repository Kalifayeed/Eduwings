import Script from "next/script";

import { capabilities, env } from "@/lib/env";

/**
 * Analytics integration point.
 *
 * Renders nothing unless an analytics script is configured, so no third-party
 * request is made in development, in CI, or on a deployment that has opted out.
 * The shape suits any privacy-first, single-script provider (Plausible, Fathom,
 * Umami); switching vendor is a change to two environment variables.
 */
function Analytics() {
  if (!capabilities.analytics || !env.NEXT_PUBLIC_ANALYTICS_SRC) return null;

  return (
    <Script
      src={env.NEXT_PUBLIC_ANALYTICS_SRC}
      data-domain={env.NEXT_PUBLIC_ANALYTICS_DOMAIN}
      strategy="afterInteractive"
      defer
    />
  );
}

export { Analytics };
