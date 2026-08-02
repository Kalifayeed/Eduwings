"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toast host. Styling is driven entirely by our semantic tokens so toasts match
 * the surrounding theme without a second colour system.
 */
function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={(resolvedTheme as ToasterProps["theme"]) ?? "system"}
      position="bottom-right"
      richColors={false}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border bg-card text-card-foreground shadow-[var(--shadow-float)] font-sans",
          title: "font-display font-semibold text-sm",
          description: "text-muted-foreground text-sm",
          actionButton: "bg-primary text-primary-foreground rounded-lg",
          cancelButton: "bg-secondary text-secondary-foreground rounded-lg",
          error: "border-destructive/30",
          success: "border-success/30",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
