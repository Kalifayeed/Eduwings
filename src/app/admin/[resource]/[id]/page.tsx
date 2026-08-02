import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";

import { routes } from "@/config/routes";
import { getAdminResource, toResourceView } from "@/lib/admin/resources";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dynamicTable } from "@/lib/supabase/dynamic";
import { formatDateTime, truncate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { ResourceForm } from "@/components/admin/resource-form";

interface PageProps {
  params: Promise<{ resource: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { resource: slug } = await params;
  const resource = getAdminResource(slug);
  return { title: resource ? `Edit ${resource.singular.toLowerCase()}` : "Not found" };
}

export default async function AdminEditPage({ params }: PageProps) {
  const { resource: slug, id } = await params;
  const resource = getAdminResource(slug);

  if (!resource) notFound();

  const supabase = await createServerSupabaseClient();
  if (!supabase) notFound();

  const { data } = await dynamicTable(supabase, resource.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const record = data as Record<string, unknown>;
  const title = String(record[resource.titleColumn] ?? resource.singular);
  const publicPath = resource.publicPath?.(record) ?? null;
  const isPublished = record.status === "published";

  return (
    <>
      <AdminPageHeader
        title={truncate(title, 70)}
        description={
          record.updated_at
            ? `Last updated ${formatDateTime(String(record.updated_at))}.`
            : undefined
        }
        breadcrumbs={[
          { label: "Dashboard", href: routes.admin.root },
          { label: resource.label, href: `${routes.admin.root}/${resource.slug}` },
          { label: truncate(title, 40), href: `${routes.admin.root}/${resource.slug}/${id}` },
        ]}
        actions={
          <>
            {resource.hasStatus ? <StatusBadge status={String(record.status ?? "draft")} /> : null}
            {publicPath && isPublished ? (
              <Button asChild variant="outline" size="sm">
                <Link href={publicPath} target="_blank" rel="noopener noreferrer">
                  <Eye className="size-4" />
                  View on site
                </Link>
              </Button>
            ) : null}
          </>
        }
      />

      <ResourceForm resource={toResourceView(resource)} record={record} />
    </>
  );
}
