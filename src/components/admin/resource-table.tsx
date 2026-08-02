"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Eye, MoreHorizontal, Pencil, Search, Send, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { cn, formatDate, formatDateTime, truncate } from "@/lib/utils";
import { routes } from "@/config/routes";
import type { AdminResourceView } from "@/lib/admin/resources";
import { deleteRecord, setStatus } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/ui/empty-state";

type Row = Record<string, unknown>;

interface ResourceTableProps {
  resource: AdminResourceView;
  rows: Row[];
  /**
   * Resolved public URL per row id. Computed on the server because the rule for
   * deriving it is a function, which cannot cross the boundary.
   */
  publicPaths: Record<string, string | null>;
  /** Delete is administrator-only; editors archive instead. */
  canDelete: boolean;
}

/**
 * The list view shared by every CMS resource.
 *
 * Filtering is client-side over an already-fetched page of rows: these tables
 * hold tens to low hundreds of records, and a server round-trip per keystroke
 * would be slower and more complex for no benefit. If a table ever outgrows
 * that, the search moves into the query in `page.tsx` and this component keeps
 * its interface.
 */
function ResourceTable({ resource, rows, publicPaths, canDelete }: ResourceTableProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [pendingDelete, setPendingDelete] = React.useState<Row | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const adminPath = `${routes.admin.root}/${resource.slug}`;

  const filtered = React.useMemo(() => {
    const term = query.trim().toLowerCase();

    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!term) return true;

      return resource.searchColumns.some((column) =>
        String(row[column] ?? "")
          .toLowerCase()
          .includes(term),
      );
    });
  }, [rows, query, statusFilter, resource.searchColumns]);

  const runAction = (label: string, action: () => Promise<{ ok: boolean; error?: string }>) => {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(label);
        router.refresh();
      } else {
        toast.error("That did not work", { description: result.error });
      }
    });
  };

  return (
    <div>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <label htmlFor="resource-search" className="sr-only">
            Search {resource.label.toLowerCase()}
          </label>
          <Input
            id="resource-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${resource.label.toLowerCase()}…`}
            className="pl-10"
          />
        </div>

        {resource.hasStatus ? (
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {["all", "published", "draft", "archived"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                aria-pressed={statusFilter === value}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                  statusFilter === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {filtered.length} of {rows.length} {resource.label.toLowerCase()}.
      </p>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? `No ${resource.label.toLowerCase()} yet` : "Nothing matches"}
          description={
            rows.length === 0
              ? `Create your first ${resource.singular.toLowerCase()} to see it here.`
              : "Try a different search term or clear the status filter."
          }
          action={
            rows.length === 0
              ? { label: `New ${resource.singular.toLowerCase()}`, href: `${adminPath}/new` }
              : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{resource.singular}</TableHead>
                {resource.columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={column.hideOnMobile ? "hidden md:table-cell" : undefined}
                  >
                    {column.header}
                  </TableHead>
                ))}
                {resource.hasStatus ? <TableHead>Status</TableHead> : null}
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((row) => {
                const id = String(row.id);
                const title = String(row[resource.titleColumn] ?? "Untitled");
                const subtitle = resource.subtitleColumn
                  ? String(row[resource.subtitleColumn] ?? "")
                  : "";
                const publicPath = publicPaths[id] ?? null;
                const status = String(row.status ?? "draft");

                return (
                  <TableRow key={id}>
                    <TableCell className="max-w-xs">
                      <Link
                        href={`${adminPath}/${id}`}
                        className="font-medium transition-colors hover:text-primary"
                      >
                        {truncate(title, 70)}
                      </Link>
                      {subtitle ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {truncate(subtitle, 90)}
                        </p>
                      ) : null}
                    </TableCell>

                    {resource.columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          "text-sm text-muted-foreground",
                          column.hideOnMobile && "hidden md:table-cell",
                        )}
                      >
                        <CellValue value={row[column.key]} format={column.format} />
                      </TableCell>
                    ))}

                    {resource.hasStatus ? (
                      <TableCell>
                        <StatusBadge status={status} />
                      </TableCell>
                    ) : null}

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={isPending}
                            aria-label={`Actions for ${title}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`${adminPath}/${id}`}>
                              <Pencil className="size-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>

                          {publicPath && status === "published" ? (
                            <DropdownMenuItem asChild>
                              <a href={publicPath} target="_blank" rel="noopener noreferrer">
                                <Eye className="size-4" />
                                View on site
                              </a>
                            </DropdownMenuItem>
                          ) : null}

                          {resource.hasStatus ? (
                            <>
                              <DropdownMenuSeparator />
                              {status !== "published" ? (
                                <DropdownMenuItem
                                  onSelect={() =>
                                    runAction("Published", () =>
                                      setStatus(resource.table, id, "published", adminPath),
                                    )
                                  }
                                >
                                  <Send className="size-4" />
                                  Publish
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onSelect={() =>
                                    runAction("Moved back to draft", () =>
                                      setStatus(resource.table, id, "draft", adminPath),
                                    )
                                  }
                                >
                                  <Undo2 className="size-4" />
                                  Unpublish
                                </DropdownMenuItem>
                              )}

                              {status !== "archived" ? (
                                <DropdownMenuItem
                                  onSelect={() =>
                                    runAction("Archived", () =>
                                      setStatus(resource.table, id, "archived", adminPath),
                                    )
                                  }
                                >
                                  <Archive className="size-4" />
                                  Archive
                                </DropdownMenuItem>
                              ) : null}
                            </>
                          ) : null}

                          {canDelete ? (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={() => setPendingDelete(row)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-4" />
                                Delete permanently
                              </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ── Delete confirmation ─────────────────────────────────────────── */}
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{String(pendingDelete?.[resource.titleColumn] ?? "")}</strong> will be removed
              from the database and cannot be recovered. If you only want it off the site, archive
              it instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const row = pendingDelete;
                setPendingDelete(null);
                if (row) {
                  runAction("Deleted", () =>
                    deleteRecord(resource.table, String(row.id), adminPath),
                  );
                }
              }}
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CellValue({ value, format }: { value: unknown; format?: string }) {
  if (value === null || value === undefined || value === "") {
    return <span className="opacity-40">—</span>;
  }

  switch (format) {
    case "date":
      return <>{formatDate(String(value), { day: "numeric", month: "short", year: "numeric" })}</>;
    case "datetime":
      return <>{formatDateTime(String(value))}</>;
    case "boolean":
      return value ? <Badge variant="success">Yes</Badge> : <span className="opacity-40">No</span>;
    case "number":
      return <span className="font-mono">{Number(value).toLocaleString("en-GB")}</span>;
    case "badge":
      return <Badge variant="secondary">{String(value)}</Badge>;
    default:
      return <>{truncate(String(value), 40)}</>;
  }
}

export { ResourceTable };
