import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

/**
 * Loosely-typed table access for genuinely generic operations.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 * PostgREST's TypeScript inference resolves column names from a *literal* table
 * name. When the table is a union — as it is in the admin console, where one
 * screen serves seven resources — it intersects the column sets of every table
 * in the union, which for our schema is empty. Every column argument then
 * resolves to `never` and nothing compiles.
 *
 * That is a real limitation of the inference, not a bug in our schema, and there
 * is no type-safe way around it: `deleteRecord(table, id)` is by construction a
 * function whose column set is unknown until runtime.
 *
 * So we confine the escape hatch to this one module rather than sprinkling
 * `as never` through the action layer. Everything that *can* be typed still is:
 * `TableName` is checked against the schema, and every non-generic query in the
 * codebase goes through the normal typed client and keeps full inference.
 *
 * Safety is not weakened by this. Row Level Security is what actually authorises
 * these writes, and it does not consult TypeScript.
 */

export type TableName = keyof Database["public"]["Tables"];

/**
 * Returns a query builder for a table whose name is only known at runtime.
 *
 * @param client A session-scoped Supabase client — never the service role one,
 *               so RLS still applies to everything built from it.
 * @param table  A table name, statically constrained to the schema.
 */
export function dynamicTable(client: SupabaseClient<Database>, table: TableName) {
  return (client as unknown as SupabaseClient).from(table);
}
