import { routes } from "@/config/routes";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaLibrary } from "@/components/admin/media-library";

export const metadata = { title: "Media library" };
export const revalidate = 0;

export default async function AdminMediaPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <AdminPageHeader
        title="Media library"
        description="Upload photographs and film, then paste the URL into an article, event or gallery item. Files are limited to 10 MB and served from a public bucket."
        breadcrumbs={[
          { label: "Dashboard", href: routes.admin.root },
          { label: "Media library", href: routes.admin.media },
        ]}
      />

      <MediaLibrary assets={data ?? []} />
    </>
  );
}
