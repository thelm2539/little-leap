/**
 * error-reporting.ts
 *
 * Replaces lovable-error-reporting.ts, which forwarded caught errors to
 * `window.__lovableEvents` -- an object only ever injected by the Lovable
 * editor. Outside that editor it was silently a no-op, so production errors
 * went nowhere.
 *
 * This is deliberately provider-agnostic. Right now it logs with structured
 * context, which at least surfaces errors in the hosting provider's function
 * logs during SSR and in the browser console on the client.
 *
 * TO WIRE UP A REAL SERVICE (recommended before a public launch): add the call
 * inside `reportError` -- e.g. Sentry's `captureException(error, { extra })`.
 * Keep the signature; every call site already passes useful context.
 */

export interface ErrorContext {
  /** Where the error was caught, e.g. "tanstack_root_error_component". */
  boundary?: string;
  [key: string]: unknown;
}

export function reportError(error: unknown, context: ErrorContext = {}) {
  const payload = {
    ...context,
    route: typeof window !== "undefined" ? window.location.pathname : undefined,
    at: new Date().toISOString(),
  };

  // Structured so it stays greppable in hosting logs.
  console.error("[little-leaps] unhandled error", payload, error);
}
