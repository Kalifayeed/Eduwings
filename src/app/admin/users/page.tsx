import { notFound } from "next/navigation";
import { Info } from "lucide-react";

import { routes } from "@/config/routes";
import { getSessionUser, isAdmin } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserTable } from "@/components/admin/user-table";

export const metadata = { title: "Users" };
export const revalidate = 0;

/**
 * Team and role management.
 *
 * Administrator-only. Note that this manages *roles*, not accounts: creating a
 * user means inviting them through Supabase Auth, which is deliberately not
 * exposed here — an admin console that can mint credentials is a much larger
 * attack surface than one that can only adjust permissions.
 */
export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!isAdmin(user)) notFound();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: true });

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="Who can sign in to this console, and what they are allowed to do."
        breadcrumbs={[
          { label: "Dashboard", href: routes.admin.root },
          { label: "Users", href: routes.admin.users },
        ]}
      />

      <Alert variant="info" className="mb-6">
        <Info aria-hidden />
        <AlertTitle>Roles, in plain terms</AlertTitle>
        <AlertDescription>
          <strong>Viewer</strong> cannot open this console at all. <strong>Editor</strong> can
          create, edit, publish and archive content. <strong>Administrator</strong> can additionally
          delete records permanently, change roles and edit site settings. To add someone, invite
          them from the Supabase dashboard — their profile appears here automatically as a viewer.
        </AlertDescription>
      </Alert>

      <UserTable users={data ?? []} currentUserId={user?.id ?? ""} />
    </>
  );
}
