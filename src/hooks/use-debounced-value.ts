"use client";

import * as React from "react";

/**
 * Returns `value` after it has stopped changing for `delayMs`.
 *
 * Used to keep interactive filtering and search from firing a request on every
 * keystroke without introducing a controlled-input lag.
 */
export function useDebouncedValue<T>(value: T, delayMs = 200): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
