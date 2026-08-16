/**
 * storage.ts
 *
 * All client-side data access for Little Leaps.
 *
 * SECURITY MODEL
 * --------------
 * Every query here runs from the browser straight against PostgREST, so RLS is
 * the entire security boundary. Two rules follow from that, and both matter:
 *
 *   1. This file NEVER writes to `family_members` or `families` directly.
 *      Those tables have no INSERT/UPDATE grant. Membership is granted only by
 *      the `create_family` and `redeem_family_invite` RPCs, which validate that
 *      the caller is actually entitled to join. (The old code upserted
 *      `family_members` from the client, which meant anyone could join any
 *      family by guessing a 21-bit code. See the migration for the full story.)
 *
 *   2. A family is identified by an opaque uuid, never by anything a user types.
 *      Invite codes are ~65-bit, hashed at rest, expiring and use-capped. They
 *      grant membership once and are then irrelevant -- they are not a password.
 *
 * localStorage holds only caches (family id, birth date) for instant first
 * paint. Nothing here trusts it for authorisation; the server re-derives
 * membership from the JWT on every request.
 */

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ACTIVITIES, DOMAIN_LABEL } from "./data";
import { DOMAIN_ORDER, type Domain } from "./taxonomy";

export type Rating = "engaged" | "neutral" | "fussy";

export interface ActivityLogRow {
  id: string;
  family_id: string;
  activity_id: string;
  activity_name: string;
  domain: string;
  rating: Rating;
  logged_at: string;
  // The baby's age in whole days at the moment this rating was logged.
  // Stored so feedback stays interpretable over time ("fussy at 6 weeks,
  // engaged at 12"). Null when no birth date was available. Captured now;
  // whether the UI surfaces it is a separate decision.
  logged_age_days: number | null;
}

const FAMILY_ID_STORE = "littleleaps.familyId";
const DOB_STORE = "littleleaps.birthDate";
const CHECKIN_KEY = "littleleaps.checkin";
const NAME_STORE = "littleleaps.babyName";
const INVITE_STORE = "littleleaps.inviteCode";
const AWAKE_STORE = "littleleaps.awakeMinutes";
const REMINDER_STORE = "littleleaps.dailyReminder";

// Legacy keys from the pre-uuid model. Cleared on first run so a stale
// family code can never be mistaken for a session.
const LEGACY_KEYS = ["littleleaps.familyKey"];

const FAMILY_EVENT = "littleleaps:family";
const BIRTHDATE_EVENT = "littleleaps:birthDate";
const LOG_EVENT = "littleleaps:log";
const NAME_EVENT = "littleleaps:babyName";
const INVITE_EVENT = "littleleaps:invite";

// ---------- Error normalisation ----------

/**
 * Turn a Supabase error into a real `Error` with a message worth showing.
 *
 * supabase-js rejects with a plain `{ message, code, details, hint }` object,
 * not an Error instance. Call sites that do `e instanceof Error ? e.message :
 * fallback` therefore threw away the real reason and showed only the fallback --
 * which is how a missing database migration surfaced as an unhelpful
 * "Could not create profile. Please try again."
 */
function asError(cause: unknown, fallback: string): Error {
  if (cause instanceof Error) return cause;

  if (cause && typeof cause === "object") {
    const e = cause as { message?: string; code?: string; hint?: string; details?: string };

    // PGRST202: function missing from the schema cache.
    // PGRST205: table missing from the schema cache.
    // Both mean the client is running ahead of the database.
    if (e.code === "PGRST202" || e.code === "PGRST205") {
      return new Error(
        "This version of the app needs a database update that hasn't been applied yet. " +
          "If you're the developer: run the migrations in supabase/migrations.",
      );
    }

    if (e.message) {
      const err = new Error(e.message);
      // Keep the structured original for the console without leaking it to the UI.
      (err as Error & { cause?: unknown }).cause = cause;
      return err;
    }
  }

  return new Error(fallback);
}

// ---------- Anonymous auth ----------

let authReadyPromise: Promise<void> | null = null;

/**
 * Ensure we have a Supabase session. Anonymous sign-in keeps onboarding
 * frictionless, which is the right call for this audience -- but it means the
 * account is only as durable as this browser's storage. Enable captcha on
 * anonymous sign-in in the Supabase dashboard before going public, or anyone
 * can mint unlimited auth.users rows.
 */
export function ensureAnonAuth(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!authReadyPromise) {
    authReadyPromise = (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
          authReadyPromise = null;
          throw error;
        }
      }
    })();
  }
  return authReadyPromise;
}

// ---------- Family id (cached locally, authoritative on the server) ----------

export function getFamilyId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(FAMILY_ID_STORE);
}

function cacheFamilyId(id: string) {
  window.localStorage.setItem(FAMILY_ID_STORE, id);
  window.dispatchEvent(new CustomEvent(FAMILY_EVENT));
}

function clearLocalSession() {
  window.localStorage.removeItem(FAMILY_ID_STORE);
  window.localStorage.removeItem(DOB_STORE);
  window.localStorage.removeItem(CHECKIN_KEY);
  window.dispatchEvent(new CustomEvent(FAMILY_EVENT));
  window.dispatchEvent(new CustomEvent(BIRTHDATE_EVENT));
}

/** Resolve this user's family from the server. RLS scopes it to their own rows. */
async function fetchMyFamilyId(): Promise<string | null> {
  const { data, error } = await supabase
    .from("family_members")
    .select("family_id, joined_at")
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw asError(error, "Could not load your family profile.");
  return data?.family_id ?? null;
}

interface FamilyProfile {
  birthDate: string | null;
  babyName: string | null;
}

/** The family's shared profile row (birth date + baby name). RLS-scoped. */
async function fetchFamilyProfile(familyId: string): Promise<FamilyProfile> {
  const { data, error } = await supabase
    .from("families")
    .select("birth_date, baby_name")
    .eq("id", familyId)
    .maybeSingle();
  if (error) throw asError(error, "Could not load your family profile.");
  return { birthDate: data?.birth_date ?? null, babyName: data?.baby_name ?? null };
}

// ---------- Onboarding ----------

/**
 * Create a new family and enrol this device as its first member.
 * Returns an invite code for sharing with a partner or a second device.
 */
export async function createFamilyProfile(birthDate: string): Promise<string> {
  await ensureAnonAuth();

  const { data: familyId, error } = await supabase.rpc("create_family", {
    p_birth_date: birthDate,
  });
  if (error) throw asError(error, "Could not create your family profile.");
  if (!familyId) throw new Error("Could not create your family profile.");

  cacheFamilyId(familyId);
  window.localStorage.setItem(DOB_STORE, birthDate);
  window.dispatchEvent(new CustomEvent(BIRTHDATE_EVENT));

  return createInviteCode(familyId);
}

/**
 * Mint a shareable invite code. The plaintext is returned once and never
 * stored -- only its SHA-256 hash lives in the database, so a leak of that
 * table yields nothing usable.
 */
export async function createInviteCode(familyId?: string): Promise<string> {
  const id = familyId ?? getFamilyId();
  if (!id) throw new Error("No family profile yet.");
  const { data, error } = await supabase.rpc("create_family_invite", {
    p_family_id: id,
  });
  if (error) throw asError(error, "Could not create an invite code.");
  if (!data) throw new Error("Could not create an invite code.");
  // Cache the plaintext so the Profile tab can display and re-share it. Only
  // the hash is stored server-side, so this local copy is the only way to show
  // the code again without minting a new one.
  window.localStorage.setItem(INVITE_STORE, data);
  window.dispatchEvent(new CustomEvent(INVITE_EVENT));
  return data;
}

/** The last invite code minted on this device, or null. */
export function getInviteCode(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(INVITE_STORE);
}

/** A shareable URL that pre-fills the invite code on the join screen. */
export function inviteUrl(code: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/?invite=${encodeURIComponent(code)}`;
}

/** Immediately invalidate every outstanding invite for this family. */
export async function revokeInviteCodes(): Promise<void> {
  const id = getFamilyId();
  if (!id) return;
  const { error } = await supabase.rpc("revoke_family_invite", { p_family_id: id });
  if (error) throw asError(error, "Could not revoke invite codes.");
  window.localStorage.removeItem(INVITE_STORE);
  window.dispatchEvent(new CustomEvent(INVITE_EVENT));
}

export function useInviteCode() {
  const [code, setCode] = useState<string | null>(() => getInviteCode());
  useEffect(() => {
    const handler = () => setCode(getInviteCode());
    window.addEventListener(INVITE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(INVITE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return code;
}

/**
 * Join a family by redeeming an invite code.
 *
 * The RPC returns a deliberately vague error for invalid/expired/exhausted
 * codes so it cannot be used to probe which codes exist.
 */
export async function joinFamilyProfile(code: string): Promise<{ birthDate: string | null }> {
  await ensureAnonAuth();

  const { data: familyId, error } = await supabase.rpc("redeem_family_invite", {
    p_code: code,
  });
  if (error) throw asError(error, "That code is not valid. Check it and try again.");
  if (!familyId) throw new Error("That code is not valid. Check it and try again.");

  cacheFamilyId(familyId);

  // Pull the family's shared profile so a joining device inherits the birth date
  // and baby name the other caregiver already set.
  const { birthDate, babyName } = await fetchFamilyProfile(familyId);
  if (birthDate) {
    window.localStorage.setItem(DOB_STORE, birthDate);
    window.dispatchEvent(new CustomEvent(BIRTHDATE_EVENT));
  }
  if (babyName) {
    window.localStorage.setItem(NAME_STORE, babyName);
    window.dispatchEvent(new CustomEvent(NAME_EVENT));
  }
  return { birthDate };
}

/**
 * Save the birth date. The RPC re-validates the range server-side -- the
 * `max=` on the date input is a convenience, not a control.
 */
export async function saveBirthDateToProfile(birthDate: string): Promise<void> {
  const familyId = getFamilyId();
  if (!familyId) throw new Error("No family profile yet.");

  const { error } = await supabase.rpc("set_family_birth_date", {
    p_family_id: familyId,
    p_birth_date: birthDate,
  });
  if (error) throw asError(error, "Could not save the birth date.");

  window.localStorage.setItem(DOB_STORE, birthDate);
  window.dispatchEvent(new CustomEvent(BIRTHDATE_EVENT));
}

/**
 * Erase this account: drops the caller's membership and hard-deletes the family
 * (and its logs) if nobody else is left in it. Required for GDPR erasure --
 * this app stores a child's date of birth and developmental observations.
 */
export async function deleteMyAccount(): Promise<void> {
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw asError(error, "Could not delete your account.");
  clearLocalSession();
  await supabase.auth.signOut();
}

/**
 * Export everything held about this family, for GDPR portability.
 */
export async function exportMyData(): Promise<{
  birthDate: string | null;
  babyName: string | null;
  activities: ActivityLogRow[];
}> {
  const familyId = getFamilyId();
  if (!familyId) return { birthDate: null, babyName: null, activities: [] };
  const [profile, logs] = await Promise.all([
    fetchFamilyProfile(familyId),
    supabase
      .from("activity_logs")
      .select("*")
      .order("logged_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as ActivityLogRow[];
      }),
  ]);
  return { birthDate: profile.birthDate, babyName: profile.babyName, activities: logs };
}

// ---------- Family hook ----------

export function useFamily() {
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // A stale pre-migration family code must never look like a session.
        LEGACY_KEYS.forEach((k) => window.localStorage.removeItem(k));

        await ensureAnonAuth();

        // The server is authoritative. The cached id is only a first-paint hint,
        // so if the two disagree the server wins.
        const serverId = await fetchMyFamilyId();
        if (cancelled) return;

        if (serverId) {
          if (serverId !== getFamilyId()) cacheFamilyId(serverId);

          // Reconcile the shared family profile (birth date + baby name).
          // Server wins when it has a value; a device-local value is backfilled
          // up once when the server has none (covers columns added after a
          // family already existed, and names set before name-sync shipped).
          const remote = await fetchFamilyProfile(serverId);

          const localDob = getBirthDate();
          if (!remote.birthDate && localDob) {
            try {
              await saveBirthDateToProfile(localDob);
            } catch (e) {
              console.warn("[littleleaps] birth date backfill failed", e);
            }
          } else if (remote.birthDate && remote.birthDate !== localDob) {
            window.localStorage.setItem(DOB_STORE, remote.birthDate);
            window.dispatchEvent(new CustomEvent(BIRTHDATE_EVENT));
          }

          const localName = getBabyName();
          if (!remote.babyName && localName) {
            try {
              await saveBabyName(localName);
            } catch (e) {
              console.warn("[littleleaps] baby name backfill failed", e);
            }
          } else if (remote.babyName && remote.babyName !== localName) {
            window.localStorage.setItem(NAME_STORE, remote.babyName);
            window.dispatchEvent(new CustomEvent(NAME_EVENT));
          }
        } else if (getFamilyId()) {
          // Cached id but no membership on the server -- the account was deleted
          // or the cache is from another profile. Drop it and re-onboard.
          clearLocalSession();
        }

        if (!cancelled) setFamilyId(serverId);
      } catch (e) {
        console.error("[littleleaps] auth/family init failed", e);
        if (!cancelled) setFamilyId(getFamilyId());
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    const handler = () => setFamilyId(getFamilyId());
    window.addEventListener(FAMILY_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      cancelled = true;
      window.removeEventListener(FAMILY_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { familyId, ready };
}

// ---------- Activity log ----------

export function useActivityLog() {
  const { familyId, ready } = useFamily();
  const [log, setLog] = useState<ActivityLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLog = useCallback(async () => {
    if (!familyId) {
      setLog([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    // No .eq("family_id", ...) needed for correctness -- RLS scopes this to the
    // caller's families. It stays as an index hint and an explicit statement of
    // intent, but the security does not depend on it.
    const { data, error: err } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("family_id", familyId)
      .order("logged_at", { ascending: false });
    if (err) {
      setError(err.message);
      setLog([]);
    } else {
      setLog((data ?? []) as ActivityLogRow[]);
    }
    setLoading(false);
  }, [familyId]);

  useEffect(() => {
    if (!ready) return;
    void fetchLog();
    const handler = () => void fetchLog();
    window.addEventListener(LOG_EVENT, handler);
    return () => window.removeEventListener(LOG_EVENT, handler);
  }, [ready, fetchLog]);

  const logRating = useCallback(
    async (activityId: string, rating: Rating) => {
      if (!familyId) throw new Error("No family profile yet");
      const activity = ACTIVITIES.find((a) => a.id === activityId);
      const { error: err } = await supabase.from("activity_logs").insert({
        family_id: familyId,
        activity_id: activityId,
        activity_name: activity?.title ?? activityId,
        domain: activity ? DOMAIN_LABEL[activity.domain] : "Unknown",
        rating,
        logged_age_days: ageDaysAt(getBirthDate()),
      });
      if (err) throw asError(err, "Could not save that rating.");
      window.dispatchEvent(new CustomEvent(LOG_EVENT));
    },
    [familyId],
  );

  const deleteEntry = useCallback(async (id: string) => {
    const { error: err } = await supabase.from("activity_logs").delete().eq("id", id);
    if (err) throw asError(err, "Could not delete that entry.");
    window.dispatchEvent(new CustomEvent(LOG_EVENT));
  }, []);

  return { log, loading, error, logRating, deleteEntry, refetch: fetchLog };
}

export function startOfWeek(d = new Date()) {
  const day = d.getDay();
  const diff = (day + 6) % 7;
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - diff);
  return s;
}

export function latestRatingFor(log: ActivityLogRow[], activityId: string): Rating | null {
  // log is already ordered desc by logged_at
  const match = log.find((e) => e.activity_id === activityId);
  return match ? match.rating : null;
}

export function countThisWeek(log: ActivityLogRow[]) {
  const start = startOfWeek().getTime();
  return log.filter((e) => new Date(e.logged_at).getTime() >= start).length;
}

/** Baby's age in whole days at `at` (default now), or null if no birth date. */
export function ageDaysAt(birthDate: string | null, at: Date = new Date()): number | null {
  if (!birthDate) return null;
  const days = Math.floor((at.getTime() - new Date(birthDate).getTime()) / 86_400_000);
  return days >= 0 ? days : 0;
}

// ---------- Activity reception (the "living record") ----------

export interface ReceptionEntry {
  rating: Rating;
  loggedAt: string;
  ageDays: number | null;
}

/** How a single activity has been received by this child, over time. */
export interface ActivityReception {
  activityId: string;
  engaged: number;
  neutral: number;
  fussy: number;
  total: number;
  latest: Rating | null;
  latestAt: string | null;
  history: ReceptionEntry[]; // newest first
}

/**
 * Fold the raw log into one reception summary per activity.
 * Expects `log` newest-first (the order useActivityLog returns).
 */
export function receptionByActivity(log: ActivityLogRow[]): Map<string, ActivityReception> {
  const map = new Map<string, ActivityReception>();
  for (const row of log) {
    let r = map.get(row.activity_id);
    if (!r) {
      r = {
        activityId: row.activity_id,
        engaged: 0,
        neutral: 0,
        fussy: 0,
        total: 0,
        latest: null,
        latestAt: null,
        history: [],
      };
      map.set(row.activity_id, r);
    }
    r[row.rating] += 1;
    r.total += 1;
    r.history.push({ rating: row.rating, loggedAt: row.logged_at, ageDays: row.logged_age_days });
    // First row seen for this activity is the newest (log is desc-ordered).
    if (r.latest === null) {
      r.latest = row.rating;
      r.latestAt = row.logged_at;
    }
  }
  return map;
}

/**
 * The two revisit categories from the product brief. This only makes them
 * *identifiable* — acting on them is deferred (see BACKLOG.md):
 *   - fussy:   activities ever marked fussy → adapt/improve for fussy babies.
 *   - engaged: activities marked engaged    → surface more often.
 * An activity can appear in both; counts let later logic weigh dominance.
 */
export function activitiesToRevisit(log: ActivityLogRow[]): {
  fussy: ActivityReception[];
  engaged: ActivityReception[];
} {
  const all = [...receptionByActivity(log).values()];
  return {
    fussy: all.filter((r) => r.fussy > 0).sort((a, b) => b.fussy - a.fussy),
    engaged: all.filter((r) => r.engaged > 0).sort((a, b) => b.engaged - a.engaged),
  };
}

// ---------- Weekly reception grid (by domain) ----------
// Powers the "what's she enjoying, week by week" card on Profile: one square
// per (domain, week), so a type of play's trajectory (fussy → settled) reads
// at a glance instead of being buried in an aggregate.

/**
 * One week's outcome for one domain: the most recent rating logged that week
 * for activities in that domain, plus how many activities contributed.
 * `rating: null` means a quiet week — nothing in that domain was logged.
 */
export interface WeekCell {
  rating: Rating | null;
  count: number;
}

export interface DomainReceptionRow {
  domain: Domain;
  cells: Map<number, WeekCell>; // week number -> cell, one entry per ReceptionGrid.weeks
}

export interface ReceptionGrid {
  weeks: number[]; // ascending, contiguous: earliest logged week through the latest
  rows: DomainReceptionRow[]; // always one row per DOMAIN_ORDER entry, even with no data
}

/**
 * Build the weekly-by-domain grid.
 *
 * Domain is re-derived from the activity's CURRENT classification (via
 * ACTIVITIES), never from the text frozen on the log row at rating time — so
 * a log entry follows the taxonomy if it's ever reorganised, the same
 * principle that fixed the milestone/activity domain drift earlier. If an
 * activity_id no longer exists in ACTIVITIES, that row is skipped.
 *
 * "Most recent wins" for a cell's colour: `log` is already newest-first (the
 * order useActivityLog returns), so the first row seen for a domain+week pair
 * is the one to keep. `count` still accumulates the full frequency for that
 * domain+week even though the colour only shows the latest outcome — surfaced
 * via tap-to-reveal rather than cell colour, so a busy week doesn't need a
 * second visual encoding competing with the rating itself.
 */
export function buildReceptionGrid(log: ActivityLogRow[]): ReceptionGrid {
  const cellsByDomain = new Map<Domain, Map<number, WeekCell>>();
  let minWeek: number | null = null;
  let maxWeek: number | null = null;

  for (const row of log) {
    if (row.logged_age_days === null) continue;
    const activity = ACTIVITIES.find((a) => a.id === row.activity_id);
    if (!activity) continue;
    const week = Math.floor(row.logged_age_days / 7);

    if (minWeek === null || week < minWeek) minWeek = week;
    if (maxWeek === null || week > maxWeek) maxWeek = week;

    let domainCells = cellsByDomain.get(activity.domain);
    if (!domainCells) {
      domainCells = new Map();
      cellsByDomain.set(activity.domain, domainCells);
    }
    const existing = domainCells.get(week);
    if (existing) {
      existing.count += 1; // rating stays as first-seen (= most recent, log is desc-ordered)
    } else {
      domainCells.set(week, { rating: row.rating, count: 1 });
    }
  }

  const weeks =
    minWeek === null || maxWeek === null
      ? []
      : Array.from({ length: maxWeek - minWeek + 1 }, (_, i) => minWeek! + i);

  const rows: DomainReceptionRow[] = DOMAIN_ORDER.map((domain) => ({
    domain,
    cells: new Map(
      weeks.map((w) => [w, cellsByDomain.get(domain)?.get(w) ?? { rating: null, count: 0 }]),
    ),
  }));

  return { weeks, rows };
}

const SENTIMENT: Record<Rating, number> = { fussy: 0, neutral: 1, engaged: 2 };

/**
 * A short, deterministic 1-2 sentence summary of the grid's clearest
 * patterns: a domain that struggled early and has settled recently, and/or
 * one that's been reliably engaged throughout. Intentionally a simple
 * rule-based heuristic (not full NLG) — tune the thresholds, not the shape.
 */
export function describeReceptionTrends(grid: ReceptionGrid): string {
  type Point = { week: number; rating: Rating };

  const series = grid.rows
    .map((row) => ({
      domain: row.domain,
      points: grid.weeks
        .map((w) => ({ week: w, rating: row.cells.get(w)?.rating ?? null }))
        .filter((p): p is Point => p.rating !== null),
    }))
    .filter((s) => s.points.length >= 2);

  if (series.length === 0) {
    return "Keep logging activities to see patterns emerge here.";
  }

  // Improving: recent points sit meaningfully more "engaged" than earlier ones.
  let improving: { domain: Domain; lastStruggleWeek: number; streak: number } | null = null;
  for (const s of series) {
    const recentN = Math.max(1, Math.min(3, s.points.length - 1));
    const earlier = s.points.slice(0, s.points.length - recentN);
    const recent = s.points.slice(s.points.length - recentN);
    if (earlier.length === 0) continue;

    const avg = (pts: Point[]) => pts.reduce((sum, p) => sum + SENTIMENT[p.rating], 0) / pts.length;
    const earlierAvg = avg(earlier);
    const recentAvg = avg(recent);

    if (earlierAvg <= 1 && recentAvg >= 1.5 && recentAvg - earlierAvg >= 1) {
      const lastStruggleIdx = [...s.points].reverse().findIndex((p) => p.rating !== "engaged");
      const lastStruggleWeek =
        lastStruggleIdx === -1
          ? s.points[0].week
          : s.points[s.points.length - 1 - lastStruggleIdx].week;
      let streak = 0;
      for (let i = s.points.length - 1; i >= 0 && s.points[i].rating === "engaged"; i--) streak++;
      improving = { domain: s.domain, lastStruggleWeek, streak };
      break; // one callout is enough
    }
  }

  // Reliable: every logged point for a domain is "engaged" (skip the one already called out above).
  const reliable = series
    .filter((s) => s.domain !== improving?.domain)
    .filter((s) => s.points.every((p) => p.rating === "engaged"))
    .sort((a, b) => b.points.length - a.points.length)[0];

  const sentences: string[] = [];
  if (improving) {
    sentences.push(
      `${DOMAIN_LABEL[improving.domain]} play was hard going until week ${improving.lastStruggleWeek}` +
        ` — the last ${improving.streak} week${improving.streak === 1 ? "" : "s"} have been settled.`,
    );
  }
  if (reliable) {
    sentences.push(`${DOMAIN_LABEL[reliable.domain]} play has been a reliable win the whole way.`);
  }

  if (sentences.length === 0) {
    const busiest = [...series].sort((a, b) => b.points.length - a.points.length)[0];
    sentences.push(`${DOMAIN_LABEL[busiest.domain]} has had the most activity so far.`);
  }

  return sentences.join(" ");
}

// ---------- Weekly confidence (Home) ----------
// A parent logging activities wants some signal back that it's adding up to
// something, even before there's enough history for describeReceptionTrends
// to find a pattern. This turns the same log into an immediate, honest read
// of "how's this week going" — domains touched + days active — derived from
// data that's already being fetched, no new query.

export interface WeeklyConfidence {
  domainsCovered: number;
  domainsTotal: number;
  activeDays: number;
}

/** `grid` is the caller's buildReceptionGrid(log) output; `currentWeek` is the baby's age in weeks. */
export function weeklyConfidence(
  log: ActivityLogRow[],
  grid: ReceptionGrid,
  currentWeek: number,
): WeeklyConfidence {
  const domainsCovered = grid.rows.filter((r) => r.cells.get(currentWeek)?.rating != null).length;

  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const days = new Set<string>();
  for (const row of log) {
    if (new Date(row.logged_at).getTime() >= since) days.add(row.logged_at.slice(0, 10));
  }

  return { domainsCovered, domainsTotal: DOMAIN_ORDER.length, activeDays: days.size };
}

/** One reassuring, honest sentence — never guilt-trips at zero, never overclaims at low volume. */
export function describeWeeklyConfidence(c: WeeklyConfidence): string {
  if (c.activeDays === 0) {
    return "Log an activity today to start tracking your week.";
  }
  if (c.domainsCovered >= 4) {
    return `Great coverage — ${c.domainsCovered} of ${c.domainsTotal} domains touched this week.`;
  }
  if (c.activeDays >= 4) {
    return `You're on track — active ${c.activeDays} days this week.`;
  }
  return `${c.activeDays} active day${c.activeDays === 1 ? "" : "s"} this week — keep it up.`;
}

/** Whether `activityId` already has a log entry for today's calendar date. */
export function ratedToday(
  log: ActivityLogRow[],
  activityId: string,
  now: Date = new Date(),
): boolean {
  const today = now.toISOString().slice(0, 10);
  return log.some((e) => e.activity_id === activityId && e.logged_at.slice(0, 10) === today);
}

// ---------- Birth date ----------
// Authoritative copy lives in families.birth_date. localStorage is a cache so
// the UI can paint before the round trip completes; useFamily() reconciles them.

export function getBirthDate(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DOB_STORE);
}

export function useBirthDate() {
  const [birthDate, setBirthDateState] = useState<string | null>(() => getBirthDate());

  useEffect(() => {
    const handler = () => setBirthDateState(getBirthDate());
    window.addEventListener(BIRTHDATE_EVENT, handler);
    window.addEventListener("storage", handler); // Sync across browser tabs
    return () => {
      window.removeEventListener(BIRTHDATE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return {
    birthDate,
    // Persists server-side first; the local cache updates on success.
    setBirthDate: (iso: string) => saveBirthDateToProfile(iso),
  };
}

// ---------- Baby name ----------
// Stored on the shared families row so both caregivers see the same name.
// localStorage is a cache for instant paint; useFamily() reconciles it with the
// server on load, and a partner inherits it via joinFamilyProfile.

export function getBabyName(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(NAME_STORE);
}

/**
 * Save the baby's name to the family (server first, then the local cache).
 * Mirrors saveBirthDateToProfile: on failure it throws and the cache is left
 * untouched, so the UI can surface the real error.
 */
export async function saveBabyName(name: string): Promise<void> {
  const familyId = getFamilyId();
  if (!familyId) throw new Error("No family profile yet.");
  const trimmed = name.trim();

  const { error } = await supabase.rpc("set_baby_name", {
    p_family_id: familyId,
    p_name: trimmed,
  });
  if (error) throw asError(error, "Could not save the name.");

  if (trimmed) window.localStorage.setItem(NAME_STORE, trimmed);
  else window.localStorage.removeItem(NAME_STORE);
  window.dispatchEvent(new CustomEvent(NAME_EVENT));
}

export function useBabyName() {
  const [name, setName] = useState<string | null>(() => getBabyName());
  useEffect(() => {
    const handler = () => setName(getBabyName());
    window.addEventListener(NAME_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(NAME_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return { babyName: name, setBabyName: saveBabyName };
}

// ---------- Preferences (device-local) ----------

export function getAwakeMinutes(): number {
  if (typeof window === "undefined") return 60;
  return Number(window.localStorage.getItem(AWAKE_STORE) ?? "60");
}

export function setAwakeMinutes(mins: number): void {
  window.localStorage.setItem(AWAKE_STORE, String(mins));
}

export function getDailyReminder(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(REMINDER_STORE) === "on";
}

export function setDailyReminder(on: boolean): void {
  window.localStorage.setItem(REMINDER_STORE, on ? "on" : "off");
}

// ---------- Family members (server, RLS-scoped to your family) ----------

export interface FamilyMemberRow {
  userId: string;
  joinedAt: string;
  isSelf: boolean;
}

/** Everyone in this device's family, newest-joined first, with `isSelf` set. */
export async function fetchFamilyMembers(): Promise<FamilyMemberRow[]> {
  const [{ data: userData }, familyId] = [await supabase.auth.getUser(), getFamilyId()];
  const uid = userData.user?.id;
  if (!familyId) return [];
  const { data, error } = await supabase
    .from("family_members")
    .select("user_id, joined_at")
    .eq("family_id", familyId)
    .order("joined_at", { ascending: true });
  if (error) throw asError(error, "Could not load your family members.");
  return (data ?? []).map((r) => ({
    userId: r.user_id,
    joinedAt: r.joined_at,
    isSelf: r.user_id === uid,
  }));
}

export function useFamilyMembers() {
  const { familyId } = useFamily();
  const [members, setMembers] = useState<FamilyMemberRow[]>([]);
  useEffect(() => {
    let cancelled = false;
    if (!familyId) {
      setMembers([]);
      return;
    }
    fetchFamilyMembers()
      .then((m) => {
        if (!cancelled) setMembers(m);
      })
      .catch((e) => console.error("[littleleaps] members load failed", e));
    return () => {
      cancelled = true;
    };
  }, [familyId]);
  return members;
}

// ---------- Check-in (localStorage only -- device-local scratch state) ----------

export function getCheckin(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CHECKIN_KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function setCheckin(data: Record<string, unknown>) {
  window.localStorage.setItem(CHECKIN_KEY, JSON.stringify(data));
}
