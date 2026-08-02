import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

import { routes } from "@/config/routes";
import { getAdminResource, toResourceView } from "@/lib/admin/resources";
import { getSessionUser, isAdmin } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ResourceTable } from "@/components/admin/resource-table";

interface PageProps {
  params: Promise<{ resource: string }>;
}

/**
 * Generic CMS list view.
 *
 * One route serves every content resource. Static admin segments — `/admin/media`,
 * `/admin/users`, `/admin/submissions`, `/admin/subscribers`, `/admin/settings` —
 * take precedence over this dynamic segment in the App Router, so those keep
 * their bespoke screens.
 */
/**
 * Never prerendered and never cached.
 *
 * `generateStaticParams` would be actively wrong here: the seven resource slugs
 * are known at build time, so Next.js would happily bake a snapshot of the
 * database into static HTML — showing editors stale rows and rendering a
 * per-user, permission-dependent view at build time when no user exists.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { resource: slug } = await params;
  const resource = getAdminResource(slug);
  return { title: resource?.label ?? "Not found" };
}

export default async function AdminResourcePage({ params }: PageProps) {
  const { resource: slug } = await params;
  const resource = getAdminResource(slug);

  if (!resource) notFound();

  const [user, supabase] = await Promise.all([getSessionUser(), createServerSupabaseClient()]);

  // The admin console reads unpublished rows; RLS grants that only to staff, and
  // the layout has already established that the caller is staff.
  const { data, error } = supabase
    ? await supabase
        .from(resource.table)
        .select("*")
        .order(resource.orderBy.column, {
          ascending: resource.orderBy.ascending,
          nullsFirst: false,
        })
        .limit(500)
    : { data: null, error: null };

  if (error) logger.error("admin.list.failed", error, { table: resource.table });

  const rows = (data ?? []) as Record<string, unknown>[];

  // The rule for deriving a public URL is a function, which cannot be sent to a
  // Client Component — so it is applied here and the results travel as data.
  const publicPaths = Object.fromEntries(
    rows.map((row) => [String(row.id), resource.publicPath?.(row) ?? null]),
  );

  return (
    <>
      <AdminPageHeader
        title={resource.label}
        description={resource.description}
        breadcrumbs={[
          { label: "Dashboard", href: routes.admin.root },
          { label: resource.label, href: `${routes.admin.root}/${resource.slug}` },
        ]}
        actions={
          <Button asChild>
            <Link href={`${routes.admin.root}/${resource.slug}/new`}>
              <Plus className="size-4" />
              New {resource.singular.toLowerCase()}
            </Link>
          </Button>
        }
      />

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Could not load {resource.label.toLowerCase()}. Check that the migrations in{" "}
            <code>supabase/migrations</code> have been applied.
          </AlertDescription>
        </Alert>
      ) : null}

      <ResourceTable
        resource={toResourceView(resource)}
        rows={rows}
        publicPaths={publicPaths}
        canDelete={isAdmin(user)}
      />
    </>
  );
}
