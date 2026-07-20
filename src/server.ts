import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

/**
 * Security headers, applied to every response.
 *
 * On CSP: TanStack Start's SSR emits inline hydration scripts, and Radix injects
 * inline styles at runtime. Enforcing a strict policy therefore needs per-request
 * nonce plumbing through the SSR entry, which is real work. Shipping
 * `script-src 'unsafe-inline'` instead would be a policy that looks like
 * protection while providing almost none — so the policy below is deliberately
 * strict and sent in Report-Only mode. Wire up nonces, confirm the report stream
 * is quiet, then switch this to `content-security-policy` to enforce.
 */
function applySecurityHeaders(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  const supabaseOrigin = process.env.SUPABASE_URL ?? "";

  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  headers.set("cross-origin-opener-policy", "same-origin");

  // Only meaningful over TLS, and setting it on plain HTTP in dev is a foot-gun.
  if (new URL(request.url).protocol === "https:") {
    headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
  }

  headers.set(
    "content-security-policy-report-only",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'", // Radix writes inline styles; unavoidable.
      "script-src 'self'",
      `connect-src 'self' ${supabaseOrigin} ${supabaseOrigin.replace(/^https:/, "wss:")}`.trim(),
    ].join("; "),
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(await normalizeCatastrophicSsrResponse(response), request);
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
        request,
      );
    }
  },
};
