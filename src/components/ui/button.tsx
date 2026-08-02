import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-all duration-200 ease-[var(--ease-out-expo)]",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "aria-invalid:ring-destructive/30 aria-invalid:border-destructive",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary-hover hover:shadow-[var(--shadow-lift)] active:translate-y-px",
        accent:
          "bg-accent text-accent-foreground shadow-[var(--shadow-soft)] hover:brightness-105 hover:shadow-[var(--shadow-lift)] active:translate-y-px",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        outline:
          "border bg-background/60 text-foreground hover:border-primary/40 hover:bg-secondary hover:text-foreground",
        ghost: "text-foreground hover:bg-secondary",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-soft)] hover:brightness-110",
        glass: "glass border text-foreground hover:brightness-105",
      },
      size: {
        sm: "h-9 rounded-lg px-3.5 text-sm",
        default: "h-11 rounded-xl px-5 text-sm",
        lg: "h-12 rounded-xl px-7 text-base",
        xl: "h-14 rounded-2xl px-8 text-base",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Render as the single child element instead of a `<button>`. */
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
