// Browser-side Supabase client. Subject to row-level security.
//
// Was Lovable-generated; now maintained by hand (see AGENTS.md).
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}


/**
 * Read a server-side env var without assuming `process` exists.
 *
 * This module is bundled for the browser as well as for SSR, and a bare
 * `process.env.X` in the client bundle is a ReferenceError waiting to happen --
 * it only survived before because the bundler happened to shim it.
 */
function serverEnv(name: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined;
  return process.env[name];
}

function createSupabaseClient() {
  // VITE_-prefixed vars are substituted at build time and are the only ones the
  // browser ever sees. The process.env fallback covers SSR.
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || serverEnv('SUPABASE_URL');
  const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || serverEnv('SUPABASE_PUBLISHABLE_KEY');

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    // Name the VITE_ vars specifically: these are baked in at BUILD time, so a
    // missing value means the build environment lacked them, not the runtime.
    // On Vercel/Netlify they must be set in the project's environment settings;
    // a local .env file is not available to the hosted build.
    const missing = [
      ...(!SUPABASE_URL ? ['VITE_SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['VITE_SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    const message =
      `Missing Supabase environment variable(s): ${missing.join(', ')}. ` +
      `Set them in your hosting provider's environment settings (and in .env for local dev), then rebuild.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});

