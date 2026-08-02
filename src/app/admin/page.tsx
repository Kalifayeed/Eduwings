import Link from "next/link";
import { ArrowRight, Inbox, Plus } from "lucide-react";

import { routes } from "@/config/routes";
import { adminResources } from "@/lib/admin/resources";
import { getSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dynamicTable } from "@/lib/supabase/dynamic";
import { formatDate, formatDateTime, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export const metadata = { title: "Dashboard" };

/** Counts change with every edit, so this view is never cached. */
export const revalidate = 0;

interface ResourceCount {
  slug: string;
  label: string;
  total: number;
  drafts: number;
}

export default async function AdminDashboardPage() {
  const [user, supabase] = await Promise.all([getSessionUser(), createServerSupabaseClient()]);

  if (!supabase) return null;

  // `head: true` fetches counts without transferring any rows.
  const counts: ResourceCount[] = await Promise.all(
    adminResources.map(async (resource) => {
      const [{ count: total }, { count: drafts }] = await Promise.all([
        dynamicTable(supabase, resource.table).select("*", { count: "exact", head: true }),
        dynamicTable(supabase, resource.table)
          .select("*", { count: "exact", head: true })
          .eq("status", "draft"),
      ]);

      return {
        slug: resource.slug,
        label: resource.label,
        total: total ?? 0,
        drafts: drafts ?? 0,
      };
    }),
  );

  const [
    { data: submissions, count: newSubmissions },
    { count: subscriberCount },
    { data: recent },
  ] = await Promise.all([
    supabase
      .from("submissions")
      .select("id, kind, name, email, subject, created_at, status", { count: "exact" })
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "subscribed"),
    supabase
      .from("articles")
      .select("id, title, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <>
      <AdminPageHeader
        title={`Good to see you, ${firstName}`}
        description="Everything the public site shows is managed from here. Drafts are invisible until you publish them."
        actions={
          <Button asChild>
            <Link href={`${routes.admin.articles}/new`}>
              <Plus className="size-4" />
              New article
            </Link>
          </Button>
        }
      />

      {/* ── Headline figures ────────────────────────────────────────────── */}
      <section aria-labelledby="figures-heading">
        <h2 id="figures-heading" className="sr-only">
          Content at a glance
        </h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li className="rounded-2xl border bg-card p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">New submissions</p>
            <p className="mt-2 font-display text-3xl font-bold">{newSubmissions ?? 0}</p>
            <Link
              href={routes.admin.submissions}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              Open the inbox
              <ArrowRight className="size-3.5" />
            </Link>
          </li>

          <li className="rounded-2xl border bg-card p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Subscribers</p>
            <p className="mt-2 font-display text-3xl font-bold">{subscriberCount ?? 0}</p>
            <Link
              href={routes.admin.subscribers}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              Manage list
              <ArrowRight className="size-3.5" />
            </Link>
          </li>

          {counts.slice(0, 2).map((count) => (
            <li key={count.slug} className="rounded-2xl border bg-card p-5">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">{count.label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{count.total}</p>
              <Link
                href={`${routes.admin.root}/${count.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                {count.drafts > 0 ? `${count.drafts} in draft` : "All published"}
                <ArrowRight className="size-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* ── Inbox ─────────────────────────────────────────────────────── */}
        <section aria-labelledby="inbox-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="inbox-heading" className="font-display text-lg font-semibold">
              Waiting for a reply
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={routes.admin.submissions}>
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          {submissions && submissions.length > 0 ? (
            <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
              {submissions.map((submission) => (
                <li key={submission.id}>
                  <Link
                    href={routes.admin.submissions}
                    className="flex items-start gap-4 p-4 transition-colors hover:bg-secondary/50"
                  >
                    <Badge variant="secondary" className="mt-0.5 shrink-0 capitalize">
                      {submission.kind.replace("-", " ")}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {submission.subject || submission.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {submission.name} · {submission.email}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(submission.created_at, { day: "numeric", month: "short" })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Inbox}
              title="The inbox is clear"
              description="Every enquiry has been dealt with. New school requests, volunteer applications and messages will appear here."
              action={{ label: "See resolved submissions", href: routes.admin.submissions }}
            />
          )}
        </section>

        {/* ── Content summary ───────────────────────────────────────────── */}
        <div className="grid gap-8">
          <section aria-labelledby="content-heading">
            <h2 id="content-heading" className="mb-4 font-display text-lg font-semibold">
              Content
            </h2>
            <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
              {counts.map((count) => (
                <li key={count.slug}>
                  <Link
                    href={`${routes.admin.root}/${count.slug}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <span className="text-sm font-medium">{count.label}</span>
                    <span className="flex items-center gap-2">
                      {count.drafts > 0 ? (
                        <Badge variant="muted">{count.drafts} draft</Badge>
                      ) : null}
                      <span className="font-mono text-sm text-muted-foreground">{count.total}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {recent && recent.length > 0 ? (
            <section aria-labelledby="recent-heading">
              <h2 id="recent-heading" className="mb-4 font-display text-lg font-semibold">
                Recently edited
              </h2>
              <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
                {recent.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={routes.admin.article(article.id)}
                      className="block px-4 py-3 transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium">{truncate(article.title, 46)}</p>
                        <StatusBadge status={article.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(article.updated_at)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
