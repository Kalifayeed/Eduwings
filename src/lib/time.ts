/**
 * Request-time clock.
 *
 * `Date.now()` is impure, and React's compiler rules rightly refuse it inside a
 * component render: on a Client Component it produces a value the server could
 * not have known, which is exactly how hydration mismatches happen.
 *
 * The event views genuinely need the current instant to decide whether an event
 * has passed, and they are Server Components on dynamic (`revalidate = 0`)
 * routes — rendered once per request, never hydrated with this value. Reading
 * the clock through a named function keeps that decision explicit and auditable
 * rather than scattering bare `Date.now()` calls through the view layer.
 *
 * Do not call this from a Client Component, and do not call it from a statically
 * generated page: the answer would be frozen at build time.
 */
export function requestTime(): number {
  return Date.now();
}
