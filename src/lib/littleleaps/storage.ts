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

// ---------- Family key (localStorage) ----------

export function getFamilyKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(FAMILY_KEY_STORE);
}

export function setFamilyKey(key: string) {
  window.localStorage.setItem(FAMILY_KEY_STORE, key);
  window.dispatchEvent(new CustomEvent("littleleaps:familyKey"));
}

export function useFamilyKey() {
  const [key, setKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setKey(getFamilyKey());
    setReady(true);
    const handler = () => setKey(getFamilyKey());
    window.addEventListener("littleleaps:familyKey", handler);
    window.addEventListener("storage", handler);
    return () => {
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
