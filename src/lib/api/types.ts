/**
 * API envelope types.
 *
 * Separated from `@/lib/api/http`, which is `server-only`, so Client Components
 * can type their `fetch` results without importing server code.
 */

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
