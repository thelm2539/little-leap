# Little Leaps — working notes

An evidence-based weekly development companion for newborns.
TanStack Start (SSR) + React 19 + Tailwind 4 + Supabase, deployed to Vercel.

## Not a Lovable project anymore

This started from a Lovable template and has been fully detached: no
`@lovable.dev/*` packages, no `.lovable/` directory, no editor instrumentation,
and `vite.config.ts` now declares its plugins directly. Nothing syncs back to
the Lovable editor, so the old "don't rewrite published history" constraint no
longer applies.

A few files still carry a `// Was Lovable-generated` header. That is a note
about provenance, not a warning — edit them freely.

## Security model

All data access runs from the browser straight against PostgREST, so **RLS is
the entire security boundary**. Two rules follow:

- Never write to `families` or `family_members` from the client. They carry no
  INSERT/UPDATE grant. Membership comes only from the `create_family` and
  `redeem_family_invite` RPCs, which validate entitlement.
- A family is identified by an opaque uuid, never by anything a user types.
  Invite codes are ~65-bit, hashed at rest, expiring and use-capped. They grant
  membership once; they are not passwords.

`src/integrations/supabase/client.server.ts` holds the service-role client,
which **bypasses RLS entirely**. Import it only from other `.server.ts` modules
— route files and `*.functions.ts` ship to the client bundle.

## Environment

`VITE_`-prefixed vars are substituted at **build** time and ship inside the
client bundle. A missing value means the *build* environment lacked it, so on
Vercel they must be set in the project's environment settings — a local `.env`
is not visible to a hosted build. See `.env.example`.

## Commands

```
bun install
bun run dev      # Vite dev server
bun run build    # Nitro auto-detects the host preset
bun run lint
```

Note: the repo is not prettier-clean at baseline, so `bun run lint` reports
pre-existing formatting errors. Check that your change does not *increase* the
count rather than expecting zero.
