import * as React from "react";

import { cn } from "@/lib/utils";
import { fieldBaseClasses } from "@/components/ui/input";

function Textarea({ className, rows = 5, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(fieldBaseClasses, "min-h-24 resize-y py-3 leading-relaxed", className)}
      {...props}
    />
  );
}

export { Textarea };
