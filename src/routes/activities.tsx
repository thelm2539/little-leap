/**
 * activities.tsx
 *
 * Route file for the /activities screen — the Milestones page.
 * In TanStack Router, each file in src/routes/ maps to a URL path.
 * This file = the /activities URL = the "Activities" tab in the bottom nav.
 *
 * This file's only job:
 *   1. Register the route with TanStack Router
 *   2. Derive the birth date from the shared DOB constant
 *   3. Wrap the page in AppShell (nav + header) and render MilestoneTimeline
 *
 * All timeline logic lives in MilestoneTimeline.tsx.
 */

import { createFileRoute } from '@tanstack/react-router';
import { AppShell } from '@/components/littleleaps/AppShell';
import { MilestoneTimeline } from '@/components/MilestoneTimeline';
import { DOB } from '@/lib/littleleaps/data';

// ─── Route definition ─────────────────────────────────────────────────────────
// The string '/activities' must match this file's name (activities.tsx).
export const Route = createFileRoute('/activities')({
  component: ActivitiesPage,
});

// ─── Page component ───────────────────────────────────────────────────────────
function ActivitiesPage() {
  // DOB is the Date object exported from data.ts — the single source of truth
  // for the baby's birth date across the whole app (used in Home, This Week, and here).
  //
  // We build "YYYY-MM-DD" using local date parts rather than .toISOString()
  // to avoid timezone issues: .toISOString() returns UTC, which can shift the
  // date by one day for users east of UTC.
  const birthDate = [
    DOB.getFullYear(),
    String(DOB.getMonth() + 1).padStart(2, '0'), // getMonth() is 0-indexed; +1 fixes that
    String(DOB.getDate()).padStart(2, '0'),
  ].join('-');

  return (
    <AppShell>
      {/* Page header — same style as Home and This Week */}
      <div className="px-5 pt-6 pb-1">
        <h1 className="font-serif text-[26px] font-bold text-foreground leading-tight">
          Milestones
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Week-by-week developmental timeline
        </p>
      </div>

      {/* MilestoneTimeline receives birthDate and handles everything from here:
          domain filter pills, spine, week grouping, cards, opacity fades */}
      <MilestoneTimeline birthDate={birthDate} />
    </AppShell>
  );
}
