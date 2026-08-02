"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * Field components bound to react-hook-form.
 *
 * These exist so that no individual form has to remember to wire `FormControl`,
 * `FormMessage` and the description id together. Every field in the product is
 * therefore labelled, described and error-announced identically — accessibility
 * by construction rather than by review.
 */

interface BaseProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  /** Marks the field visually and for assistive technology. */
  required?: boolean;
  className?: string;
}

function RequiredMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return (
    <span className="text-destructive" aria-hidden>
      *
    </span>
  );
}

interface TextFieldProps<T extends FieldValues> extends BaseProps<T> {
  type?: "text" | "email" | "tel" | "url" | "number";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.ComponentProps<"input">["inputMode"];
}

function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
}: TextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            <RequiredMark required={required} />
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              required={required}
              value={field.value ?? ""}
              // Numeric fields must reach the schema as numbers, not strings —
              // the schemas deliberately avoid `z.coerce`.
              onChange={
                type === "number"
                  ? (event) =>
                      field.onChange(
                        event.target.value === "" ? undefined : event.target.valueAsNumber,
                      )
                  : field.onChange
              }
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface TextareaFieldProps<T extends FieldValues> extends BaseProps<T> {
  placeholder?: string;
  rows?: number;
}

function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  placeholder,
  rows = 5,
}: TextareaFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            <RequiredMark required={required} />
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              required={required}
              value={field.value ?? ""}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface SelectFieldProps<T extends FieldValues> extends BaseProps<T> {
  options: readonly string[];
  placeholder?: string;
}

function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  options,
  placeholder = "Choose one…",
}: SelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            <RequiredMark required={required} />
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface CheckboxFieldProps<T extends FieldValues> extends Omit<BaseProps<T>, "label"> {
  label: React.ReactNode;
}

function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
}: CheckboxFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("grid-cols-[auto_1fr] items-start gap-x-3", className)}>
          <FormControl>
            <Checkbox
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              className="mt-0.5"
            />
          </FormControl>
          <div className="grid gap-1.5">
            <FormLabel className="leading-relaxed font-normal">{label}</FormLabel>
            {description ? <FormDescription>{description}</FormDescription> : null}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export { CheckboxField, SelectField, TextareaField, TextField };
