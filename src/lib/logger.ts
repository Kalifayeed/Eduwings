import { isProduction } from "@/lib/env";

/**
 * Minimal structured logger.
 *
 * The codebase bans bare `console.*` calls, because unlabelled log lines are
 * useless in a production log stream and easy to leave behind by accident.
 * Everything goes through here instead, which gives every line a scope, a level
 * and a consistent shape — and gives us one place to add a log drain later.
 *
 * `debug` is suppressed in production; `warn` and `error` always emit.
 */

type Level = "debug" | "info" | "warn" | "error";

function emit(level: Level, scope: string, message: unknown, context?: unknown) {
  if (level === "debug" && isProduction) return;

  const payload = {
    level,
    scope,
    time: new Date().toISOString(),
    message: message instanceof Error ? message.message : message,
    ...(message instanceof Error && !isProduction ? { stack: message.stack } : {}),
    ...(context !== undefined ? { context } : {}),
  };

  const line = JSON.stringify(payload);

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (scope: string, message: unknown, context?: unknown) =>
    emit("debug", scope, message, context),
  info: (scope: string, message: unknown, context?: unknown) =>
    emit("info", scope, message, context),
  warn: (scope: string, message: unknown, context?: unknown) =>
    emit("warn", scope, message, context),
  error: (scope: string, message: unknown, context?: unknown) =>
    emit("error", scope, message, context),
};
