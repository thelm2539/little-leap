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

export type Rating = "engaged" | "neutral" | "fussy";

export interface ActivityLogRow {
  id: string;
  family_id: string;
  activity_id: string;
  activity_name: string;
  domain: string;
  rating: Rating;
  logged_at: string;
}

const FAMILY_ID_STORE = "littleleaps.familyId";
const DOB_STORE = "littleleaps.birthDate";
const CHECKIN_KEY = "littleleaps.checkin";

// Legacy keys from the pre-uuid model. Cleared on first run so a stale
// family code can never be mistaken for a session.
const LEGACY_KEYS = ["littleleaps.familyKey"];

const FAMILY_EVENT = "littleleaps:family";
const BIRTHDATE_EVENT = "littleleaps:birthDate";
const LOG_EVENT = "littleleaps:log";

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
  if (error) throw error;
  return data?.family_id ?? null;
}

async function fetchBirthDate(familyId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("families")
    .select("birth_date")
    .eq("id", familyId)
    .maybeSingle();
  if (error) throw error;
  return data?.birth_date ?? null;
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
  if (error) throw error;
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
  if (error) throw error;
  if (!data) throw new Error("Could not create an invite code.");
  return data;
}

/** Immediately invalidate every outstanding invite for this family. */
export async function revokeInviteCodes(): Promise<void> {
  const id = getFamilyId();
  if (!id) return;
  const { error } = await supabase.rpc("revoke_family_invite", { p_family_id: id });
  if (error) throw error;
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
  if (error) throw error;
  if (!familyId) throw new Error("That code is not valid. Check it and try again.");

  cacheFamilyId(familyId);

  const birthDate = await fetchBirthDate(familyId);
  if (birthDate) {
    window.localStorage.setItem(DOB_STORE, birthDate);
    window.dispatchEvent(new CustomEvent(BIRTHDATE_EVENT));
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
  if (error) throw error;

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
  if (error) throw error;
  clearLocalSession();
  await supabase.auth.signOut();
}

/**
 * Export everything held about this family, for GDPR portability.
 */
export async function exportMyData(): Promise<{
  birthDate: string | null;
  activities: ActivityLogRow[];
}> {
  const familyId = getFamilyId();
  if (!familyId) return { birthDate: null, activities: [] };
  const [birthDate, logs] = await Promise.all([
    fetchBirthDate(familyId),
    supabase
      .from("activity_logs")
      .select("*")
      .order("logged_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as ActivityLogRow[];
      }),
  ]);
  return { birthDate, activities: logs };
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

          // Backfill: birth_date never existed as a column before this release,
          // so migrated families have NULL. Push up the local copy once.
          const remote = await fetchBirthDate(serverId);
          const local = getBirthDate();
          if (!remote && local) {
            try {
              await saveBirthDateToProfile(local);
            } catch (e) {
              console.warn("[littleleaps] birth date backfill failed", e);
            }
          } else if (remote && remote !== local) {
            window.localStorage.setItem(DOB_STORE, remote);
            window.dispatchEvent(new CustomEvent(BIRTHDATE_EVENT));
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
      });
      if (err) throw err;
      window.dispatchEvent(new CustomEvent(LOG_EVENT));
    },
    [familyId],
  );

  const deleteEntry = useCallback(async (id: string) => {
    const { error: err } = await supabase.from("activity_logs").delete().eq("id", id);
    if (err) throw err;
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
