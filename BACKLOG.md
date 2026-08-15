# Launch backlog

Work deferred while getting the secure family model live. None of these block
local testing or a staging deploy; they are the gap between "works" and
"safe to publish to the public." Roughly in priority order.

Context for all of these: the app uses anonymous Supabase auth (frictionless
onboarding), RLS is the entire security boundary, and it stores a child's birth
date plus developmental observations. See AGENTS.md for the security model.

---

## 1. Clear test data before first real launch

End-to-end verification left rows in the production database: a test family, an
activity log, and several anonymous test users. Harmless, but they shouldn't be
in a live app.

Run once in the Supabase SQL Editor, immediately before going public (it wipes
ALL app data, so not after real users exist):

```sql
truncate public.activity_logs, public.family_invites,
         public.invite_redeem_attempts, public.family_members,
         public.families cascade;
delete from auth.users where is_anonymous = true;
```

Effort: 2 minutes. No code change.

---

## 2. Captcha on anonymous sign-in

**Why:** anonymous sign-in is free and unlimited. Without a captcha, anyone can
script the creation of unlimited `auth.users` rows against the project — an
abuse vector and a billing risk. The `redeem_family_invite` rate limiter is
keyed on user id, so an attacker who can mint fresh users at will can also reset
that counter.

**Where:** Supabase dashboard → Authentication → Attack Protection → enable
Captcha (hCaptcha or Turnstile). Then wire the token into the client:
`supabase.auth.signInAnonymously({ options: { captchaToken } })` in
`ensureAnonAuth()` (src/lib/littleleaps/storage.ts). Needs a captcha widget in
the onboarding UI to produce the token.

Effort: ~half a day (dashboard + client + a widget).

---

## 3. Email-upgrade path (durable accounts)

**Why:** an anonymous account lives only in the browser's localStorage. Clear
the browser or lose the device and the account is gone — unless the user saved
an invite code to rejoin from another device. For a published app that is a
support burden and a trust problem.

**Approach:** keep anonymous-first onboarding, but after a few days of use prompt
"add an email to secure your account." `supabase.auth.updateUser({ email })`
upgrades the same anonymous user into a permanent one **without** losing the
uid — so all their families and logs carry over untouched. Requires enabling an
email provider (magic link is lowest-friction) in the Supabase dashboard.

Effort: ~1 day including the prompt UI and the confirmation round-trip.

---

## 4. Security headers

**Why:** the app currently sends none. Before growing the surface (and before
moving the session token off localStorage, if that happens) these are cheap
defense in depth.

**Where:** `src/server.ts` already wraps every response — clean insertion point.
Add: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
and HSTS. The CSP needs to allow the Supabase URL (connect-src) and the Google
Fonts hosts already used in `src/routes/__root.tsx`.

Effort: ~half a day, mostly getting the CSP allowlist right without breaking
fonts or Supabase calls.

---

## 5. Privacy policy + GDPR flows

**Why:** the app stores a child's date of birth and developmental ratings —
personal data about a minor, with health-adjacent inferences. A public launch
in most jurisdictions needs a privacy policy and working data-subject rights.

**What's already done:** the server side exists —
`delete_my_account()` (erasure, cascades cleanly) and the client `exportMyData()`
(portability) are implemented in storage.ts and the schema.

**What's left:**
- A privacy policy page (what's collected, why, retention, contact).
- UI to trigger delete and export from within the app (buttons → the existing
  functions), with a confirm step on delete.
- A retention decision for abandoned anonymous accounts (e.g. a scheduled job
  deleting anonymous users with no activity after N months).
- Cookie/consent handling if any analytics get added later.

Effort: ~1–2 days plus whatever legal review you want on the policy text.

---

## 6. Act on the fussy / engaged activity categories

**Why:** activity ratings now carry the baby's age at log time, and
`activitiesToRevisit(log)` in storage.ts already surfaces two categories — but
nothing acts on them yet. This is where the reception data pays off.

**What's captured:** every rating stores `logged_age_days`;
`receptionByActivity()` folds the log into per-activity tallies + history;
`activitiesToRevisit()` returns `{ fussy, engaged }` lists. The Milestones tab
shows the living record per activity.

**What's left (two deferred product decisions):**
- **Fussy → adapt.** For activities repeatedly marked fussy, offer a gentler
  variant or a "try this differently" note. Decide the threshold (any fussy? a
  fussy-majority? fussy at a given age?) using the stored age.
- **Engaged → surface more.** For activities marked engaged, increase their
  frequency in the Home tab's daily rotation so parent and baby get more of what
  works. Today the rotation in index.tsx is a flat day-offset cycle; weight it
  by reception.

Effort: ~1–2 days once the thresholds/weighting rules are decided.

## 7. Verify the sleep-milestone DOIs — DONE (widened into a full DOI audit)

**Original scope:** fill the 6 `doi: 'verify'` placeholders on `s01`–`s03`.

**What actually happened (2026-08-15):** every DOI in `milestones.ts` — not
just the sleep ones — was checked against Crossref. 9 of 18 distinct citations
had a real problem, not just the 6 placeholders:

- 1 broken DOI that didn't resolve at all (Reddy V et al. 1997, `m19`) — fixed
  by swapping to a working DOI for the same chapter (a 2026 Routledge reissue,
  same title, same authors).
- 7 citations where the DOI resolved to a **real but different paper** than
  the title claimed — e.g. the DOI cited for "Mittag M & Kuhl PK et al. (2022)
  — Early language skills predict school readiness" actually belongs to a
  paper about dyslexia risk with no Kuhl as an author at all. Two of these
  (`m03`, `m04`) turned out to be real papers with the *wrong DOI* attached
  rather than a wrong title — fixed by finding the correct DOI instead of
  relabeling.
- 1 citation (Atkinson, Vetere & Grayson 1995, `s03`) has a real, correctly-
  DOI'd paper, but its actual subject — temperament and sleep patterns in
  pre-school children — is a looser fit for the separation-anxiety claim it's
  backing than its old (fabricated) title implied. Title corrected to the
  real one; **left as an open editorial question** whether to keep, replace
  (Scher & Blumberg 1999, `10.1046/j.1365-2214.1999.00099.x`, is a closer
  topical match), or adjust what `s03` claims it supports.
- The remaining 6 sleep-milestone DOIs and 4 other citations were confirmed
  correct as written.

Fixed in `milestones.ts`, regenerated into `supabase/seed-content.sql`, and
applied to the live `content_milestones` table (15 rows bumped to version 2,
`updated_by = 'doi-audit-2026-08-15'`).

**What's left:** decide on the Atkinson/Scher question above.

## 8. Sync baby name to the family — DONE

Baby name is now stored on `families.baby_name` via the `set_baby_name` RPC and
inherited by a partner's device (migration `20260803120000_baby_name.sql`).
Kept here only as a pointer; nothing outstanding.

## 9. Preferences (awake window + daily reminder)

**Status:** the Preferences section was removed from the Profile tab for now.
The Home tab still has its own awake-window slider (device-local), and the
`getAwakeMinutes` / `getDailyReminder` helpers remain in storage.ts unused by
any screen.

**If/when preferences return:**
- Decide per-family vs per-device (awake window is arguably per-device).
- **Daily reminder delivery** was never wired to anything — it only persisted a
  flag. Real delivery needs a channel: web push (service worker + Push API,
  neither of which exists yet) or email via the Supabase project. Collect a
  reminder time and schedule it. Don't re-expose the toggle until it actually
  sends something.

Effort: reminder delivery ~2–3 days including the service worker + permission flow.

## 10. No activities are tagged domain "motor"

**Why it matters:** the new "Activity trends" grid on Profile (one row per
domain, one square per week) has a permanently empty Motor row — confirmed
live with seeded test data spanning 9 weeks, every Motor cell showed "no
activities logged." This isn't a bug in the grid; `ACTIVITIES` in data.ts
genuinely has zero entries with `domain: "motor"` (noted in that file's own
header comment: "no activities tagged motor yet; motor milestones draw on
sensory activities like tummy-time"). The Milestones tab's Motor filter still
works because milestones reference *sensory* activities like tummy-time for
their motor content — but that means Motor never accumulates its own
reception history.

**What's left:** either add dedicated motor-domain activities (tummy-time
variants, reaching/grasping practice, rolling encouragement, etc.) so Motor
has content to log against, or accept that Motor stays milestone-only and
consider hiding/greying its row in the reception grid instead of showing a
permanently blank one.

Effort: content work, not code — depends on how many motor activities you want.

## 11. Toast notifications may not be rendering

**Why it matters:** discovered while testing the new grid's tap-to-reveal
detail (`toast()` from `sonner`, called on tapping a cell). In the dev
preview, no toast ever appeared — confirmed via DOM inspection
(`[data-sonner-toast]` never appears) after directly firing click events,
bypassing any pointer-simulation flakiness. To rule out a bug in the new code,
the same check was run against the pre-existing "Engaged/Neutral/Fussy" rating
buttons on Home (`RatingButtons` in ActivityBits.tsx, using the identical
`toast()` call pattern, shipped well before this session) — same result, no
toast. So this is a pre-existing, app-wide gap, not something introduced by
the reception grid.

**Caveat:** this was only checked in the local dev preview, which logged
several `Content-Security-Policy` report-only violations (inline scripts,
Google Fonts stylesheet, a worker) unrelated to sonner but indicating the
preview's CSP differs from a real deployment — so this needs re-confirming on
the actual deployed site before treating it as a real bug. If it reproduces
there too: check the `Toaster` mount in AppShell.tsx, the installed `sonner`
version, and whether its portal is being blocked or unmounted.

Effort: ~1 hour to confirm on the real deployment; more if it's a genuine bug.

## 12. Content management: move activities/milestones off static TS files

**Why:** `ACTIVITIES` (data.ts) and `MILESTONES` (milestones.ts) are hardcoded
arrays — any content change needs a code review and a full deploy. Once this
ships to an app store, a wording fix would mean a new binary and store
review, which is the wrong tool for a content-only change. The intent is to
let a separate content-curation workflow (human or agent-driven) update
activities/milestones without touching app code, and have it sync to every
device the same way `activity_logs` already does.

**What's done (schema only, not yet wired to the client):**
- [supabase/migrations/20260812120000_content_management.sql](supabase/migrations/20260812120000_content_management.sql)
  adds `content_activities` / `content_milestones`, mirroring the current
  `Activity`/`Milestone` TS shapes field-for-field. A `status` column
  (`draft` / `published` / `archived`) gates visibility — RLS lets anyone
  read `published` rows, and a new low-privilege `content_curator` Postgres
  role can INSERT/UPDATE but only ever in `draft` state (enforced by RLS
  `with check (status = 'draft')`, not by trust). It has no grants on any
  other table — a compromised curator credential can edit draft content and
  nothing else.
- [supabase/schema-setup.sql](supabase/schema-setup.sql) got the same
  tables/policies/role folded in, for fresh installs.
- [scripts/generate-content-seed.ts](scripts/generate-content-seed.ts)
  generates [supabase/seed-content.sql](supabase/seed-content.sql) directly
  from the live `ACTIVITIES`/`MILESTONES` arrays (31 activities, 22
  milestones) — generated, not hand-transcribed, so the seed can't drift
  from the real content. Seeds as `status = 'published'` since this is
  already-reviewed launch content, not a draft.

**What's left:**
- Run the migration, then `supabase/seed-content.sql`, in the Supabase SQL
  editor (not done yet — needs the user's DB access).
- Set a password for `content_curator` separately (`alter role
  content_curator with password '...'` — do NOT commit it) and hand that
  connection string to whatever curates content. It's a direct Postgres
  connection, not the anon/publishable key — this role isn't reachable
  through PostgREST without custom JWT claims, which isn't needed for one
  trusted back-office writer.
- **The client-side swap is the real remaining work.** `data.ts`/
  `milestones.ts` are imported as synchronous constant arrays in a lot of
  places (`ACTIVITIES.find()`, `getMilestonesForWeek()`, the reception grid's
  domain lookup, etc.). Moving to DB-backed content means: keep the current
  arrays as an offline/first-paint fallback, add a fetch-with-cache layer
  (fetch `published` rows once, cache in localStorage with a version stamp,
  serve from cache on subsequent loads), and thread a loading state through
  everywhere that currently assumes the data is already there. This touches
  most of the domain logic and several components — worth doing as its own
  focused pass, not bundled into the schema change.
- No promote-draft-to-published UI yet; for now that's a manual `UPDATE ...
  SET status = 'published'` run as the table owner (bypasses RLS). Worth a
  small RPC or admin screen once there's real review volume.

## Notes

- Items 2 and 3 are the two that most change the risk profile of a public
  launch; do them first.
- The `service_role` key is still unused by the app. Do not add it to `.env` or
  Vercel until something server-side actually needs it — it bypasses RLS.
