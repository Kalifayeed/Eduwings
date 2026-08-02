import { notFound } from "next/navigation";

import { routes } from "@/config/routes";
import { getAdminResource, toResourceView } from "@/lib/admin/resources";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ResourceForm } from "@/components/admin/resource-form";

interface PageProps {
  params: Promise<{ resource: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { resource: slug } = await params;
  const resource = getAdminResource(slug);
  return { title: resource ? `New ${resource.singular.toLowerCase()}` : "Not found" };
}

export default async function AdminCreatePage({ params }: PageProps) {
  const { resource: slug } = await params;
  const resource = getAdminResource(slug);

  if (!resource) notFound();

  return (
    <>
      <AdminPageHeader
        title={`New ${resource.singular.toLowerCase()}`}
        description={`Create a ${resource.singular.toLowerCase()}. It stays a draft until you publish it.`}
        breadcrumbs={[
          { label: "Dashboard", href: routes.admin.root },
          { label: resource.label, href: `${routes.admin.root}/${resource.slug}` },
          { label: "New", href: `${routes.admin.root}/${resource.slug}/new` },
        ]}
      />

      <ResourceForm resource={toResourceView(resource)} record={null} />
    </>
  );
}
