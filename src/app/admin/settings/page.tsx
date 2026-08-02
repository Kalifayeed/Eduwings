import { notFound } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { capabilities, siteUrl } from "@/lib/env";
import { getSessionUser, isAdmin } from "@/lib/auth/session";
import { getContentSource } from "@/lib/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Settings" };
export const revalidate = 0;

/**
 * Operational settings and deployment diagnostics.
 *
 * The capability panel exists because the most common support question on a site
 * like this is "why did my form not send an email?" — and the answer is almost
 * always a missing environment variable. Showing which capabilities are live
 * turns that into something an operator can diagnose themselves.
 */
export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  if (!isAdmin(user)) notFound();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase.from("site_settings").select("*");
  const settings = new Map((data ?? []).map((row) => [row.key, row.value]));

  const announcement = (settings.get("announcement") ?? {}) as Record<string, unknown>;
  const schoolRequests = (settings.get("school_requests_open") ?? {}) as Record<string, unknown>;

  const capabilityRows = [
    {
      label: "Database and authentication",
      active: capabilities.supabase,
      detail: "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      consequence: "Without these the site serves bundled seed content and this console is closed.",
    },
    {
      label: "Privileged server access",
      active: capabilities.supabaseAdmin,
      detail: "SUPABASE_SERVICE_ROLE_KEY",
      consequence: "Without this, public form submissions are not saved to the database.",
    },
    {
      label: "Transactional email",
      active: capabilities.email,
      detail: "RESEND_API_KEY, EMAIL_FROM and EMAIL_TO_ADMIN",
      consequence:
        "Without these, forms still work but no notification or acknowledgement is sent.",
    },
    {
      label: "Analytics",
      active: capabilities.analytics,
      detail: "NEXT_PUBLIC_ANALYTICS_SRC",
      consequence: "Optional. No third-party script is loaded when this is unset.",
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Operational toggles and a read-out of what this deployment can currently do."
        breadcrumbs={[
          { label: "Dashboard", href: routes.admin.root },
          { label: "Settings", href: routes.admin.settings },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section aria-labelledby="toggles-heading">
          <h2 id="toggles-heading" className="mb-4 font-display text-lg font-semibold">
            Site controls
          </h2>
          <SettingsForm
            announcement={{
              enabled: Boolean(announcement.enabled),
              message: String(announcement.message ?? ""),
              href: String(announcement.href ?? ""),
            }}
            schoolRequestsOpen={Boolean(schoolRequests.enabled ?? true)}
          />
        </section>

        <div className="grid gap-8">
          <section aria-labelledby="capabilities-heading">
            <h2 id="capabilities-heading" className="mb-4 font-display text-lg font-semibold">
              Deployment capabilities
            </h2>

            <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
              {capabilityRows.map((row) => (
                <li key={row.label} className="flex gap-3 p-4">
                  {row.active ? (
                    <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-success" />
                  ) : (
                    <XCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {row.label}
                      {row.active ? null : (
                        <Badge variant="muted" className="ml-2">
                          Not configured
                        </Badge>
                      )}
                    </p>
                    <p className="mt-1 font-mono text-[0.7rem] break-all text-muted-foreground">
                      {row.detail}
                    </p>
                    {row.active ? null : (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {row.consequence}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="deployment-heading">
            <h2 id="deployment-heading" className="mb-4 font-display text-lg font-semibold">
              Deployment
            </h2>

            <dl className="divide-y overflow-hidden rounded-2xl border bg-card text-sm">
              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="text-muted-foreground">Canonical URL</dt>
                <dd className="truncate font-mono text-xs">{siteUrl}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="text-muted-foreground">Content source</dt>
                <dd>
                  <Badge variant={getContentSource().kind === "supabase" ? "success" : "accent"}>
                    {getContentSource().kind === "supabase" ? "Live database" : "Bundled seed"}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="text-muted-foreground">Organisation</dt>
                <dd className="truncate">{siteConfig.legalName}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="text-muted-foreground">Public contact</dt>
                <dd className="truncate">{siteConfig.contact.email}</dd>
              </div>
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Organisation details, navigation and career content are versioned in the repository
              rather than the database, so a change to them goes through code review. Edit{" "}
              <code className="rounded bg-muted px-1 py-0.5">src/config/site.ts</code>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
