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

## 7. Verify the sleep-milestone DOIs

**Why:** the three sleep milestones (`s01`–`s03` in milestones.ts) ship with
`doi: 'verify'` placeholders. The citations are real works but the DOI strings
were not confirmed and must not be faked. The milestone file's whole premise is
"primary authors only," so these need real DOIs before publishing.

**What's left:** confirm and fill the DOI for each of: Rivkees (2003); McGraw et
al. (1999); de Weerd & van den Bossche (2003); Grigg-Damberger (2016); Scher
(2005); Atkinson et al. (1995). Search each title on doi.org / a scholarly index
and paste the real `10.xxxx/...` string.

Effort: ~1 hour.

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

## Notes

- Items 2 and 3 are the two that most change the risk profile of a public
  launch; do them first.
- The `service_role` key is still unused by the app. Do not add it to `.env` or
  Vercel until something server-side actually needs it — it bypasses RLS.
