import { useEffect, useState, useCallback } from "react";

export type Rating = "engaged" | "neutral" | "fussy";

export interface RatingEntry {
  activityId: string;
  rating: Rating;
  date: string; // ISO date (YYYY-MM-DD)
  ts: number;
}

const LOG_KEY = "littleleaps.activityLog";
const CHECKIN_KEY = "littleleaps.checkin";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("littleleaps:storage"));
}

export function useActivityLog() {
  const [log, setLog] = useState<RatingEntry[]>([]);

  useEffect(() => {
    setLog(read<RatingEntry[]>(LOG_KEY, []));
    const handler = () => setLog(read<RatingEntry[]>(LOG_KEY, []));
    window.addEventListener("littleleaps:storage", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("littleleaps:storage", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const logRating = useCallback((activityId: string, rating: Rating) => {
    const current = read<RatingEntry[]>(LOG_KEY, []);
    const entry: RatingEntry = {
      activityId,
      rating,
      date: new Date().toISOString().slice(0, 10),
      ts: Date.now(),
    };
    write(LOG_KEY, [...current, entry]);
  }, []);

  return { log, logRating };
}

export function startOfWeek(d = new Date()) {
  const day = d.getDay(); // 0 sun
  const diff = (day + 6) % 7; // make monday start
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - diff);
  return s;
}

export function latestRatingFor(log: RatingEntry[], activityId: string): Rating | null {
  const matches = log.filter((e) => e.activityId === activityId);
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.ts - a.ts)[0].rating;
}

export function countThisWeek(log: RatingEntry[]) {
  const start = startOfWeek().getTime();
  return log.filter((e) => e.ts >= start).length;
}

export function getCheckin(): Record<string, unknown> {
  return read<Record<string, unknown>>(CHECKIN_KEY, {});
}

export function setCheckin(data: Record<string, unknown>) {
  write(CHECKIN_KEY, data);
}
