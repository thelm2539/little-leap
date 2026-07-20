/**
 * Vite config.
 *
 * This replaces `@lovable.dev/vite-tanstack-config`, which bundled the plugins
 * below behind a single import. Everything it did that this project actually
 * needs is reproduced here explicitly; what was dropped, and why:
 *
 *   - componentTagger / lovable-tagger      -- Lovable editor instrumentation
 *   - dev-server-bridge, hmr-gate           -- Lovable sandbox plumbing
 *   - sandbox detection, forced port 8080   -- Lovable sandbox plumbing
 *   - SSR/serverFn dev error loggers        -- reported into the Lovable editor
 *   - explicit `import.meta.env.VITE_*` define
 *         Vite already substitutes VITE_-prefixed vars from .env files and from
 *         the host's environment, so the manual define was redundant.
 *   - `css.transformer: "lightningcss"`
 *         Only reached lightningcss via a transitive Lovable dependency. Vite's
 *         default PostCSS pipeline now runs in both dev and build, so the
 *         dev/build parity that setting was chasing still holds.
 *   - `nitro({ defaultPreset: "cloudflare-module" })`
 *         Lovable defaulted deploys to Cloudflare. No preset is pinned here, so
 *         Nitro auto-detects the host -- which is what we want on Vercel.
 */
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Fail the build if client code pulls in a server-only module, rather than
      // silently shipping it to the browser. Matters here: client.server.ts holds
      // the service-role Supabase client, which bypasses RLS entirely.
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      // Route SSR through src/server.ts -- our error wrapper and security headers.
      server: { entry: "server" },
    }),
    // Nitro participates in builds only; `vite dev` uses Vite's own dev server.
    ...(command === "build" ? [nitro()] : []),
    viteReact(),
  ],
  resolve: {
    // Vite 8 resolves tsconfig `paths` natively, so the vite-tsconfig-paths
    // plugin Lovable bundled is no longer needed.
    tsconfigPaths: true,
    // Belt and braces: keep "@" explicit so a tsconfig edit cannot silently
    // break resolution across the whole app.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // A second copy of React or the query client breaks hooks and cache identity.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
}));
