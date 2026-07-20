/**
 * age.ts
 *
 * Pure helper functions for calculating and formatting the baby's age.
 *
 * Previously these functions imported DOB from data.ts (a hardcoded date).
 * Now they accept birthDate as a parameter — an ISO string like "2026-06-09"
 * that comes from localStorage via useBirthDate(). This means any user can
 * enter their own baby's birth date and the app responds correctly.
 *
 * These are plain functions (not hooks), so they work anywhere: components,
 * other utility files, or eventually server-side code.
 */

/**
 * Calculate the baby's age from a birth date string.
 * Returns totalDays, weeks, and remaining days.
 *
 * @param birthDate - ISO string "YYYY-MM-DD"
 * @param now       - defaults to today; pass a specific date for testing
 */
export function getAge(birthDate: string, now = new Date()) {
  // Guard: if birthDate hasn't been entered yet, return zero age
  if (!birthDate) return { totalDays: 0, weeks: 0, days: 0 };

  // new Date("YYYY-MM-DD") parses as UTC midnight, which is consistent
  // regardless of the user's timezone — week counts are approximate anyway.
  const birth = new Date(birthDate);
  const ms = now.getTime() - birth.getTime();
  const totalDays = Math.floor(ms / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays - weeks * 7;
  return { totalDays, weeks, days };
}

/**
 * Returns a human-readable age string.
 * e.g. "6 weeks, 3 days old"  or  "Due in 5 days" for future dates.
 */
export function ageLabel(birthDate: string, now = new Date()) {
  const { totalDays, weeks, days } = getAge(birthDate, now);
  if (totalDays < 0) {
    const due = Math.abs(totalDays);
    return `Due in ${due} day${due === 1 ? "" : "s"}`;
  }
  return `${weeks} week${weeks === 1 ? "" : "s"}, ${days} day${days === 1 ? "" : "s"} old`;
}

/**
 * Returns a time-of-day greeting — nothing to do with birth date.
 * Signature unchanged.
 */
export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Returns the birth date formatted for display.
 * e.g. "9 June 2026"
 */
export function dobFormatted(birthDate: string) {
  if (!birthDate) return "";
  return new Date(birthDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
