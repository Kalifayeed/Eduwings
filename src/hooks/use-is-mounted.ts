"use client";

import { useSyncExternalStore } from "react";

/** No-op subscribe: the value never changes after hydration. */
const subscribe = () => () => {};

/**
 * `false` during server rendering and the first client paint, `true` afterwards.
 *
 * Some things genuinely cannot be rendered on the server — the resolved colour
 * theme, a live countdown, whether the browser supports the Web Share API. The
 * usual `useState(false)` plus `useEffect(() => setMounted(true))` works, but
 * sets state synchronously inside an effect, which triggers a second render pass
 * and is flagged by React's compiler rules.
 *
 * `useSyncExternalStore` is the primitive designed for exactly this: it takes a
 * separate server snapshot, so React renders the correct value on each side
 * without a cascading re-render.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
