"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2, Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn, formatDateTime } from "@/lib/utils";
import { routes } from "@/config/routes";
import { SUBMISSION_KINDS, type SubmissionStatus } from "@/lib/content/types";
import { deleteRecord, updateRecord } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface SubmissionRow {
  id: string;
  kind: string;
  status: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  payload: unknown;
  created_at: string;
}

const STATUS_OPTIONS: { value: SubmissionStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in-progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "archived", label: "Archived" },
];

const STATUS_VARIANT: Record<string, "default" | "accent" | "success" | "muted"> = {
  new: "default",
  "in-progress": "accent",
  resolved: "success",
  archived: "muted",
};

/**
 * Triage list for public form submissions.
 *
 * Each entry expands in place to show the full payload, so an operator can read
 * a school's request without losing their position in the list. Filters live in
 * the URL so a filtered inbox can be bookmarked or shared with a colleague.
 */
function SubmissionList({
  submissions,
  activeKind,
  activeStatus,
  canDelete,
}: {
  submissions: SubmissionRow[];
  activeKind?: string;
  activeStatus: string;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const run = (label: string, action: () => Promise<{ ok: boolean; error?: string }>) => {
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

  const filterHref = (params: { kind?: string; status?: string }) => {
    const search = new URLSearchParams();
    const kind = params.kind ?? activeKind;
    const status = params.status ?? activeStatus;
    if (kind) search.set("kind", kind);
    if (status && status !== "all") search.set("status", status);
    const query = search.toString();
    return query ? `${routes.admin.submissions}?${query}` : routes.admin.submissions;
  };

  return (
    <div>
      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="mb-6 grid gap-3">
        <nav aria-label="Filter by form" className="flex flex-wrap gap-1.5">
          <FilterLink href={filterHref({ kind: "" })} active={!activeKind}>
            All forms
          </FilterLink>
          {SUBMISSION_KINDS.map((kind) => (
            <FilterLink key={kind} href={filterHref({ kind })} active={activeKind === kind}>
              <span className="capitalize">{kind.replace("-", " ")}</span>
            </FilterLink>
          ))}
        </nav>

        <nav aria-label="Filter by status" className="flex flex-wrap gap-1.5">
          <FilterLink href={filterHref({ status: "all" })} active={activeStatus === "all"}>
            Any status
          </FilterLink>
          {STATUS_OPTIONS.map((option) => (
            <FilterLink
              key={option.value}
              href={filterHref({ status: option.value })}
              active={activeStatus === option.value}
            >
              {option.label}
            </FilterLink>
          ))}
        </nav>
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          title="Nothing matches those filters"
          description="Try another form type, or clear the status filter."
          action={{ label: "Clear filters", href: routes.admin.submissions }}
        />
      ) : (
        <ul className="grid gap-3">
          {submissions.map((submission) => {
            const isOpen = expanded === submission.id;

            return (
              <li key={submission.id} className="overflow-hidden rounded-2xl border bg-card">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : submission.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-secondary/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {submission.kind.replace("-", " ")}
                      </Badge>
                      <Badge variant={STATUS_VARIANT[submission.status] ?? "muted"}>
                        {STATUS_OPTIONS.find((option) => option.value === submission.status)
                          ?.label ?? submission.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(submission.created_at)}
                      </span>
                    </div>

                    <p className="mt-2.5 font-medium">
                      {submission.subject || `Message from ${submission.name}`}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {submission.name} · {submission.email}
                    </p>
                  </div>

                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {isOpen ? (
                  <div className="border-t px-5 py-5">
                    {submission.message ? (
                      <div className="rounded-xl bg-secondary/50 p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {submission.message}
                        </p>
                      </div>
                    ) : null}

                    <PayloadTable payload={submission.payload} />

                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-5">
                      <Button asChild variant="outline" size="sm">
                        <a href={`mailto:${submission.email}`}>
                          <Mail className="size-4" />
                          Reply by email
                        </a>
                      </Button>

                      {submission.phone ? (
                        <Button asChild variant="outline" size="sm">
                          <a href={`tel:${submission.phone.replace(/\s/g, "")}`}>
                            <Phone className="size-4" />
                            {submission.phone}
                          </a>
                        </Button>
                      ) : null}

                      <div className="ml-auto flex flex-wrap items-center gap-1.5">
                        {STATUS_OPTIONS.filter((option) => option.value !== submission.status).map(
                          (option) => (
                            <Button
                              key={option.value}
                              variant="ghost"
                              size="sm"
                              disabled={isPending}
                              onClick={() =>
                                run(`Marked ${option.label.toLowerCase()}`, () =>
                                  updateRecord(
                                    "submissions",
                                    submission.id,
                                    { status: option.value },
                                    routes.admin.submissions,
                                  ),
                                )
                              }
                            >
                              {isPending ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Check className="size-3.5" />
                              )}
                              {option.label}
                            </Button>
                          ),
                        )}

                        {canDelete ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              run("Deleted", () =>
                                deleteRecord(
                                  "submissions",
                                  submission.id,
                                  routes.admin.submissions,
                                ),
                              )
                            }
                          >
                            <Trash2 className="size-3.5" />
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Renders the form-specific `payload` jsonb as a readable definition list. */
function PayloadTable({ payload }: { payload: unknown }) {
  if (!payload || typeof payload !== "object") return null;

  const entries = Object.entries(payload as Record<string, unknown>).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  if (entries.length === 0) return null;

  return (
    <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key} className="flex flex-wrap gap-x-2 text-sm">
          <dt className="text-muted-foreground capitalize">
            {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
          </dt>
          <dd className="font-medium">
            {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export { SubmissionList };
