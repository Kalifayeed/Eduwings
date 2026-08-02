import * as React from "react";

import { cn } from "@/lib/utils";

export const fieldBaseClasses = [
  "w-full rounded-xl border bg-background/60 px-4 text-sm text-foreground",
  "transition-colors duration-200 outline-none",
  "placeholder:text-muted-foreground/70",
  "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/25",
  "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium",
];

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldBaseClasses, "h-11", className)}
      {...props}
    />
  );
}

export { Input };
