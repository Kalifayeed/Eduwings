import { Mail } from "lucide-react";

import { routes } from "@/config/routes";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ExportButton } from "@/components/admin/export-button";

export const metadata = { title: "Subscribers" };
export const revalidate = 0;

export default async function AdminSubscribersPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  const subscribers = data ?? [];
  const active = subscribers.filter((row) => row.status === "subscribed");

  return (
    <>
      <AdminPageHeader
        title="Newsletter subscribers"
        description={`${active.length} active of ${subscribers.length} total. One email a term — that promise is on the sign-up form, so keep to it.`}
        breadcrumbs={[
          { label: "Dashboard", href: routes.admin.root },
          { label: "Subscribers", href: routes.admin.subscribers },
        ]}
        actions={
          subscribers.length > 0 ? (
            <ExportButton
              filename="eduwings-subscribers"
              rows={subscribers.map((row) => ({
                email: row.email,
                name: row.name ?? "",
                status: row.status,
                source: row.source,
                subscribed_at: row.created_at,
              }))}
            />
          ) : null
        }
      />

      {subscribers.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No subscribers yet"
          description="Sign-ups from the footer form and the newsletter band will appear here."
          action={{ label: "See the public site", href: routes.home }}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Name</TableHead>
                <TableHead className="hidden md:table-cell">Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">
                    <a
                      href={`mailto:${subscriber.email}`}
                      className="transition-colors hover:text-primary"
                    >
                      {subscriber.email}
                    </a>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {subscriber.name || <span className="opacity-40">—</span>}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {subscriber.source}
                  </TableCell>
                  <TableCell>
                    <Badge variant={subscriber.status === "subscribed" ? "success" : "muted"}>
                      {subscriber.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(subscriber.created_at, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
