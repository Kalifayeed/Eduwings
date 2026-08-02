import { createElement } from "react";
import type { LucideProps } from "lucide-react";

import { resolveIcon } from "@/lib/icons";

/**
 * Renders an icon chosen by name at runtime.
 *
 * Content records store an icon *name* rather than a component, so the concrete
 * component is only known during render. Assigning that lookup to a capitalised
 * local (`const Icon = resolveIcon(...)`) and using it as a JSX tag reads as
 * defining a component inside render — which React's compiler rules reject,
 * because a component identity that changes between renders defeats
 * reconciliation and memoisation.
 *
 * `createElement` with a dynamic type expresses the actual intent: we are
 * creating an *element* from an existing component, not creating a component.
 */
function Icon({ name, ...props }: { name: string } & LucideProps) {
  return createElement(resolveIcon(name), props);
}

export { Icon };
