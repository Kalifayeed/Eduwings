import { Inbox } from "lucide-react";

import { routes } from "@/config/routes";
import { SUBMISSION_KINDS, SUBMISSION_STATUSES } from "@/lib/content/types";
import { getSessionUser, isAdmin } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SubmissionList } from "@/components/admin/submission-list";

export const metadata = { title: "Submissions" };
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ kind?: string; status?: string }>;
}

/**
 * Form submission inbox.
 *
 * Bespoke rather than generic because submissions are not editorial content:
 * they are never created or edited here, only triaged, and the useful view is a
 * threaded list with the full payload rather than a table of columns.
 */
export default async function AdminSubmissionsPage({ searchParams }: PageProps) {
  const { kind, status } = await searchParams;

  const [user, supabase] = await Promise.all([getSessionUser(), createServerSupabaseClient()]);
  if (!supabase) return null;

  let builder = supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  // Narrow the query-string values against the known sets rather than trusting
  // them — they arrive from the URL and go straight into a filter.
  const selectedKind = SUBMISSION_KINDS.find((value) => value === kind);
  const selectedStatus = SUBMISSION_STATUSES.find((value) => value === status);

  if (selectedKind) builder = builder.eq("kind", selectedKind);
  if (selectedStatus) builder = builder.eq("status", selectedStatus);

  const { data } = await builder;
  const submissions = data ?? [];

  return (
    <>
      <AdminPageHeader
        title="Submissions"
        description="Everything sent through the public forms: school visit requests, volunteer applications, partnership enquiries, donations and messages."
        breadcrumbs={[
          { label: "Dashboard", href: routes.admin.root },
          { label: "Submissions", href: routes.admin.submissions },
        ]}
      />

      {submissions.length === 0 && !selectedKind && !status ? (
        <EmptyState
          icon={Inbox}
          title="No submissions yet"
          description="When someone requests a school visit, applies to volunteer or sends a message, it will appear here."
          action={{ label: "See the public forms", href: routes.schools }}
        />
      ) : (
        <SubmissionList
          submissions={submissions}
          activeKind={selectedKind}
          activeStatus={status ?? "all"}
          canDelete={isAdmin(user)}
        />
      )}
    </>
  );
}
