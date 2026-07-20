import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ACTIVITIES, DOMAIN_LABEL } from "./data";

export type Rating = "engaged" | "neutral" | "fussy";

export interface ActivityLogRow {
  id: string;
  family_key: string;
  activity_id: string;
  activity_name: string;
  domain: string;
  rating: Rating;
  logged_at: string;
}

const FAMILY_KEY_STORE = "littleleaps.familyKey";
const CHECKIN_KEY = "littleleaps.checkin";

// ---------- Anonymous auth ----------

let authReadyPromise: Promise<void> | null = null;

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

// ---------- Family key (localStorage + family_members) ----------

export function getFamilyKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(FAMILY_KEY_STORE);
}

async function persistFamilyMembership(key: string) {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) throw new Error("Not signed in");
  const { error } = await supabase
    .from("family_members")
    .upsert({ auth_uid: uid, family_key: key }, { onConflict: "auth_uid" });
  if (error) throw error;
}

export async function setFamilyKey(key: string) {
  await ensureAnonAuth();
  await persistFamilyMembership(key);
  window.localStorage.setItem(FAMILY_KEY_STORE, key);
  window.dispatchEvent(new CustomEvent("littleleaps:familyKey"));
}

export function useFamilyKey() {
  const [key, setKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureAnonAuth();
        let current = getFamilyKey();
        if (!current) {
          // Recover from server in case localStorage was cleared on this device
          const { data } = await supabase
            .from("family_members")
            .select("family_key")
            .maybeSingle();
          if (data?.family_key) {
            window.localStorage.setItem(FAMILY_KEY_STORE, data.family_key);
            current = data.family_key;
          }
        }
        if (cancelled) return;
        setKey(current);
      } catch (e) {
        console.error("[littleleaps] auth/family init failed", e);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    const handler = () => setKey(getFamilyKey());
    window.addEventListener("littleleaps:familyKey", handler);
    window.addEventListener("storage", handler);
    return () => {
      cancelled = true;
      window.removeEventListener("littleleaps:familyKey", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { familyKey: key, setFamilyKey, ready };
}

// ---------- Activity log (Supabase) ----------

export function useActivityLog() {
  const { familyKey, ready } = useFamilyKey();
  const [log, setLog] = useState<ActivityLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLog = useCallback(async () => {
    if (!familyKey) {
      setLog([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("family_key", familyKey)
      .order("logged_at", { ascending: false });
    if (err) {
      setError(err.message);
      setLog([]);
    } else {
      setLog((data ?? []) as ActivityLogRow[]);
    }
    setLoading(false);
  }, [familyKey]);

  useEffect(() => {
    if (!ready) return;
    void fetchLog();
    const handler = () => void fetchLog();
    window.addEventListener("littleleaps:log", handler);
    return () => window.removeEventListener("littleleaps:log", handler);
  }, [ready, fetchLog]);

  const logRating = useCallback(
    async (activityId: string, rating: Rating) => {
      if (!familyKey) throw new Error("No family code set");
      const activity = ACTIVITIES.find((a) => a.id === activityId);
      const { error: err } = await supabase.from("activity_logs").insert({
        family_key: familyKey,
        activity_id: activityId,
        activity_name: activity?.title ?? activityId,
        domain: activity ? DOMAIN_LABEL[activity.domain] : "Unknown",
        rating,
      });
      if (err) throw err;
      window.dispatchEvent(new CustomEvent("littleleaps:log"));
    },
    [familyKey],
  );

  return { log, loading, error, logRating, refetch: fetchLog };
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

// ---------- Birth date (localStorage only) ----------
// We store the birth date as an ISO string "YYYY-MM-DD" in localStorage so it
// persists between sessions without requiring a login. When we migrate to Supabase
// user accounts this will move server-side, but the hook interface stays the same.

const DOB_STORE = "littleleaps.birthDate";

/** Read the stored birth date, or null if the user hasn't entered one yet. */
export function getBirthDate(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DOB_STORE);
}

/**
 * Save a new birth date and notify all useBirthDate() hooks to re-read.
 * @param iso - date string in "YYYY-MM-DD" format (what <input type="date"> returns)
 */
export function setBirthDate(iso: string): void {
  window.localStorage.setItem(DOB_STORE, iso);
  // A custom event notifies every useBirthDate() hook in the same tab.
  // The "storage" event covers other tabs on the same device.
  window.dispatchEvent(new CustomEvent("littleleaps:birthDate"));
}

/**
 * React hook that reads the birth date from localStorage and stays in sync.
 * Returns null if no birth date has been entered yet — the BirthDateGate
 * component handles showing the setup dialog in that case.
 */
export function useBirthDate() {
  const [birthDate, setBirthDateState] = useState<string | null>(() => getBirthDate());

  useEffect(() => {
    const handler = () => setBirthDateState(getBirthDate());
    window.addEventListener("littleleaps:birthDate", handler);
    window.addEventListener("storage", handler); // Sync across browser tabs
    return () => {
      window.removeEventListener("littleleaps:birthDate", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return {
    birthDate,
    // setBirthDate is exposed so BirthDateGate can update without importing
    // the raw setBirthDate function separately
    setBirthDate: (iso: string) => setBirthDate(iso),
  };
}

// ---------- Check-in (still localStorage) ----------

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
