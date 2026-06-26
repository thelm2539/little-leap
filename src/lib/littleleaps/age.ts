import { DOB } from "./data";

export function getAge(now = new Date()) {
  const ms = now.getTime() - DOB.getTime();
  const totalDays = Math.floor(ms / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays - weeks * 7;
  return { totalDays, weeks, days };
}

export function ageLabel(now = new Date()) {
  const { totalDays, weeks, days } = getAge(now);
  if (totalDays < 0) {
    const due = Math.abs(totalDays);
    return `Due in ${due} day${due === 1 ? "" : "s"}`;
  }
  return `${weeks} week${weeks === 1 ? "" : "s"}, ${days} day${days === 1 ? "" : "s"} old`;
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function dobFormatted() {
  return DOB.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
