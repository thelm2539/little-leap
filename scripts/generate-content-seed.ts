/**
 * generate-content-seed.ts
 *
 * One-time generator: reads the current ACTIVITIES/MILESTONES arrays (the
 * live source of truth today) and emits SQL INSERT statements for the new
 * content_activities / content_milestones tables (see
 * supabase/migrations/20260812120000_content_management.sql).
 *
 * Generated, not hand-written, so the seed can't drift from the real content
 * through transcription error. Run once, review the output, then run it in
 * the Supabase SQL editor. Re-running this script after further edits to
 * data.ts/milestones.ts (before the client switches to reading from the DB)
 * would just regenerate an equivalent file — safe, but there should be only
 * one seed moment before the client cuts over.
 *
 * Usage: node scripts/generate-content-seed.ts > supabase/seed-content.sql
 */

import { ACTIVITIES } from "../src/lib/littleleaps/data.ts";
import { MILESTONES } from "../src/lib/littleleaps/milestones.ts";

function sqlString(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

function sqlStringArray(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return "'{}'";
  // Two escaping layers: Postgres array-literal escaping (backslash, double
  // quote) for the array format itself, then SQL string-literal escaping
  // (doubled single quote) for the '...' that wraps the whole array text —
  // content here is full of apostrophes ("arm's length"), which would
  // otherwise terminate the outer string literal early.
  const items = arr.map((s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",");
  const body = `{${items}}`;
  return `'${body.replace(/'/g, "''")}'`;
}

function sqlJson(value: unknown): string {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

function sqlNullable(s: string | undefined | null): string {
  return s === undefined || s === null ? "null" : sqlString(s);
}

const lines: string[] = [];

lines.push("-- ============================================================================");
lines.push("-- Generated seed: content_activities / content_milestones");
lines.push("-- Source: src/lib/littleleaps/data.ts + milestones.ts, at the moment this was");
lines.push("-- generated. Run ONCE in the Supabase SQL editor, after");
lines.push("-- 20260812120000_content_management.sql. Seeded as 'published' — this is the");
lines.push("-- real, already-reviewed launch content, not a draft awaiting approval.");
lines.push("-- ============================================================================");
lines.push("");
lines.push("begin;");
lines.push("");

for (const a of ACTIVITIES) {
  lines.push(
    `insert into public.content_activities ` +
      `(id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, ` +
      `instructions, duration_minutes, why_it_works, week_recommended, sources, ` +
      `short_term_benefits, long_term_benefits, status, updated_by)\nvalues (\n` +
      `  ${sqlString(a.id)},\n` +
      `  ${sqlString(a.title)},\n` +
      `  ${sqlString(a.domain)},\n` +
      `  ${sqlNullable(a.subDomain)},\n` +
      `  ${sqlString(a.ageWindowWeeks)},\n` +
      `  ${sqlString(a.processSupported)},\n` +
      `  ${sqlString(a.evidenceBasis)},\n` +
      `  ${sqlStringArray(a.instructions)},\n` +
      `  ${a.durationMinutes},\n` +
      `  ${sqlString(a.whyItWorks)},\n` +
      `  ${a.weekRecommended},\n` +
      `  ${sqlJson(a.sources ?? [])},\n` +
      `  ${sqlStringArray(a.shortTermBenefits)},\n` +
      `  ${sqlStringArray(a.longTermBenefits)},\n` +
      `  'published',\n` +
      `  'seed'\n` +
      `)\non conflict (id) do nothing;`,
  );
  lines.push("");
}

for (const m of MILESTONES) {
  lines.push(
    `insert into public.content_milestones ` +
      `(id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, ` +
      `activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)\nvalues (\n` +
      `  ${sqlString(m.id)},\n` +
      `  ${sqlString(m.name)},\n` +
      `  ${sqlString(m.domain)},\n` +
      `  ${sqlNullable(m.kind)},\n` +
      `  ${m.weekStart},\n` +
      `  ${m.weekPeak},\n` +
      `  ${m.weekEnd},\n` +
      `  ${sqlString(m.mechanism)},\n` +
      `  ${sqlStringArray(m.parentCanSee)},\n` +
      `  ${sqlStringArray(m.activityIds)},\n` +
      `  ${sqlJson(m.resources)},\n` +
      `  ${sqlString(m.checkIn)},\n` +
      `  ${sqlString(m.accelerator)},\n` +
      `  ${sqlString(m.latestResearch)},\n` +
      `  'published',\n` +
      `  'seed'\n` +
      `)\non conflict (id) do nothing;`,
  );
  lines.push("");
}

lines.push("commit;");
lines.push("");

console.log(lines.join("\n"));
