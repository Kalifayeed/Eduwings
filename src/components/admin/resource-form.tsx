"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Send } from "lucide-react";
import { toast } from "sonner";

import { cn, slugify } from "@/lib/utils";
import { routes } from "@/config/routes";
import type { AdminField, AdminResourceView } from "@/lib/admin/resources";
import { createRecord, updateRecord } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Values = Record<string, unknown>;

interface ResourceFormProps {
  resource: AdminResourceView;
  /** Existing record when editing; `null` when creating. */
  record: Values | null;
}

/**
 * The create/edit form shared by every CMS resource.
 *
 * Driven entirely by `resource.fields`, so a new field is a config line rather
 * than a component change. Two behaviours worth calling out:
 *
 *  • **Slug derivation.** A slug follows its source field until the editor types
 *    in it, then stops — so a new article gets a sensible URL automatically, and
 *    editing an existing one never silently changes a published address.
 *
 *  • **Save and publish.** Publishing is one action rather than "save, then find
 *    the status dropdown, then save again", which is where drafts get stranded.
 */
function ResourceForm({ resource, record }: ResourceFormProps) {
  const router = useRouter();
  const adminPath = `${routes.admin.root}/${resource.slug}`;
  const isEditing = record !== null;

  const [values, setValues] = React.useState<Values>(() => buildInitialValues(resource, record));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isPending, startTransition] = React.useTransition();

  // Once an editor edits a derived field by hand, it stops following its source.
  const touchedDerived = React.useRef(new Set<string>());

  const setValue = (field: AdminField, value: unknown) => {
    setValues((current) => {
      const next = { ...current, [field.name]: value };

      for (const candidate of resource.fields) {
        if (
          candidate.deriveFrom === field.name &&
          !touchedDerived.current.has(candidate.name) &&
          typeof value === "string"
        ) {
          next[candidate.name] = slugify(value);
        }
      }

      return next;
    });

    setErrors((current) => {
      if (!current[field.name]) return current;
      const next = { ...current };
      delete next[field.name];
      return next;
    });
  };

  const validate = (): boolean => {
    const found: Record<string, string> = {};

    for (const field of resource.fields) {
      if (!field.required) continue;
      const value = values[field.name];
      const empty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      if (empty) found[field.name] = `${field.label} is required.`;
    }

    setErrors(found);

    if (Object.keys(found).length > 0) {
      toast.error("Some fields need attention", {
        description: "Required fields are marked below.",
      });
      // Move focus to the first problem rather than leaving the editor hunting.
      const first = Object.keys(found)[0];
      if (first) document.getElementById(`field-${first}`)?.focus();
      return false;
    }

    return true;
  };

  const save = (publish: boolean) => {
    const candidate = publish ? { ...values, status: "published" } : values;

    setValues(candidate);
    if (!validate()) return;

    const payload = toRowPayload(resource, candidate);

    startTransition(async () => {
      const result = isEditing
        ? await updateRecord(resource.table, String(record.id), payload, adminPath)
        : await createRecord(resource.table, payload, adminPath);

      if (!result.ok) {
        toast.error("Could not save", { description: result.error });
        return;
      }

      toast.success(publish ? "Published" : isEditing ? "Changes saved" : "Created");
      router.push(adminPath);
      router.refresh();
    });
  };

  const status = String(values.status ?? "draft");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save(false);
      }}
      noValidate
    >
      <div className="grid gap-6 rounded-2xl border bg-card p-6 sm:grid-cols-2 sm:p-8">
        {resource.fields.map((field) => (
          <FieldControl
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={(value) => setValue(field, value)}
            onDerivedTouch={() => touchedDerived.current.add(field.name)}
          />
        ))}
      </div>

      {/* Sticky action bar — long forms otherwise bury the save button. */}
      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 rounded-2xl border glass p-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={adminPath}>
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>

        <div className="ml-auto flex flex-wrap gap-2">
          <Button type="submit" variant="outline" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isEditing ? "Save changes" : "Save draft"}
          </Button>

          {resource.hasStatus && status !== "published" ? (
            <Button type="button" onClick={() => save(true)} disabled={isPending}>
              <Send className="size-4" />
              Save and publish
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}

/* ─────────────────────────────── Field control ───────────────────────────── */

interface FieldControlProps {
  field: AdminField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  onDerivedTouch: () => void;
}

function FieldControl({ field, value, error, onChange, onDerivedTouch }: FieldControlProps) {
  const id = `field-${field.name}`;
  const describedBy = [field.description ? `${id}-description` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  const label = (
    <Label htmlFor={id} className={error ? "text-destructive" : undefined}>
      {field.label}
      {field.required ? (
        <span className="text-destructive" aria-hidden>
          *
        </span>
      ) : null}
    </Label>
  );

  const meta = (
    <>
      {field.description ? (
        <p id={`${id}-description`} className="text-xs leading-relaxed text-muted-foreground">
          {field.description}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </>
  );

  const wrapperClass = cn("grid gap-2", field.full || isWide(field.type) ? "sm:col-span-2" : "");

  if (field.type === "switch") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 sm:col-span-2",
          "rounded-xl border p-4",
        )}
      >
        <div className="grid gap-1">
          {label}
          {meta}
        </div>
        <Switch id={id} checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className={wrapperClass}>
        {label}
        <Select value={String(value ?? "")} onValueChange={onChange}>
          <SelectTrigger
            id={id}
            aria-describedby={describedBy || undefined}
            aria-invalid={Boolean(error)}
          >
            <SelectValue placeholder="Choose one…" />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {meta}
      </div>
    );
  }

  if (field.type === "textarea" || field.type === "markdown" || field.type === "list") {
    return (
      <div className={wrapperClass}>
        {label}
        <Textarea
          id={id}
          rows={field.rows ?? 5}
          value={toTextValue(field, value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
          className={
            field.type === "markdown" ? "font-mono text-[0.85rem] leading-relaxed" : undefined
          }
        />
        {meta}
      </div>
    );
  }

  const inputType =
    field.type === "number"
      ? "number"
      : field.type === "date"
        ? "date"
        : field.type === "datetime"
          ? "datetime-local"
          : field.type === "url"
            ? "url"
            : "text";

  return (
    <div className={wrapperClass}>
      {label}
      <Input
        id={id}
        type={inputType}
        value={toTextValue(field, value)}
        placeholder={field.placeholder}
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
        className={field.type === "slug" ? "font-mono text-sm" : undefined}
        onChange={(event) => {
          if (field.deriveFrom) onDerivedTouch();
          const raw = event.target.value;
          onChange(field.type === "number" ? (raw === "" ? null : Number(raw)) : raw);
        }}
      />
      {meta}
    </div>
  );
}

/* ──────────────────────────────── Conversion ─────────────────────────────── */

function isWide(type: AdminField["type"]) {
  return type === "textarea" || type === "markdown" || type === "list";
}

/** Database value → the string a text input can hold. */
function toTextValue(field: AdminField, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return field.type === "tags" ? value.join(", ") : value.join("\n");

  if (field.type === "datetime" && typeof value === "string") {
    // `datetime-local` requires `YYYY-MM-DDTHH:mm` with no timezone suffix.
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (part: number) => String(part).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  if (field.type === "date" && typeof value === "string") return value.slice(0, 10);

  return String(value);
}

function buildInitialValues(resource: AdminResourceView, record: Values | null): Values {
  const values: Values = { ...resource.defaults };

  for (const field of resource.fields) {
    const existing = record?.[field.name];
    if (existing !== undefined) values[field.name] = existing;
    else if (!(field.name in values)) values[field.name] = field.type === "switch" ? false : "";
  }

  return values;
}

/** Form values → the row payload the database expects. */
function toRowPayload(resource: AdminResourceView, values: Values): Values {
  const payload: Values = {};

  for (const field of resource.fields) {
    const raw = values[field.name];

    switch (field.type) {
      case "tags":
        payload[field.name] = splitList(raw, ",");
        break;

      case "list":
        payload[field.name] = splitList(raw, "\n");
        break;

      case "number":
        payload[field.name] = raw === "" || raw === null || raw === undefined ? null : Number(raw);
        break;

      case "switch":
        payload[field.name] = Boolean(raw);
        break;

      case "datetime":
        // `datetime-local` yields local wall time; store it as an absolute instant.
        payload[field.name] = raw ? new Date(String(raw)).toISOString() : null;
        break;

      case "date":
        payload[field.name] = raw ? String(raw) : null;
        break;

      default: {
        const text = typeof raw === "string" ? raw.trim() : raw;
        // Empty optional strings become NULL so that "no value" is one thing in
        // the database rather than two.
        payload[field.name] = text === "" && !field.required ? null : text;
      }
    }
  }

  return payload;
}

function splitList(raw: unknown, separator: string): string[] {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw !== "string") return [];
  return raw
    .split(separator)
    .map((part) => part.trim())
    .filter(Boolean);
}

export { ResourceForm };
