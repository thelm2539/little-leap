/**
 * activities.tsx
 *
 * The route file for the /activities screen — now the Milestones screen.
 * In TanStack Router, each file in src/routes/ maps to a URL path.
 * This file = the /activities URL = the "Activities" tab in the bottom nav.
 *
 * This file's only job is to:
 *   1. Define the route (tell the router this page exists at /activities)
 *   2. Read the baby's birth date from the user profile
 *   3. Render the page shell (header) + pass the birth date to MilestoneTimeline
 *
 * All the timeline logic lives in MilestoneTimeline.tsx — this file just
 * wires it up to the router and provides the data it needs.
 */

// createFileRoute is TanStack Router's way of registering this file as a route.
// The string '/activities' must match the file name (activities.tsx).
import { createFileRoute } from '@tanstack/react-router';

// The timeline component that does the actual rendering.
import { MilestoneTimeline } from '../components/MilestoneTimeline';

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO GET birthDate FROM THE USER'S PROFILE:
//
// Open src/routes/this-week.tsx and look at the top of the file.
// Find where it reads the baby's birth date — there will be a Supabase query
// or a custom hook (e.g. useQuery, useBabyProfile, useProfile, useBaby etc.).
//
// Copy that import and hook call here, then replace the hardcoded date below.
//
// Example of what it might look like (your actual code will differ):
//   import { useProfile } from '../lib/littleleaps/data';
//   const { data: profile } = useProfile();
//   const birthDate = profile?.birth_date ?? '';
//
// The ?? '' means: "if birth_date is null or undefined, use an empty string."
// An empty string passed to getBabyAgeWeeks() returns 0 weeks, which is safe.
// ─────────────────────────────────────────────────────────────────────────────


// ─── Route definition ─────────────────────────────────────────────────────────
// This registers the route with TanStack Router.
// The component property tells the router which component to render for /activities.
export const Route = createFileRoute('/activities')({
  component: ActivitiesPage,
});


// ─── Page component ───────────────────────────────────────────────────────────
function ActivitiesPage() {

  // TODO: Replace this hardcoded date with the birth date from the user's profile.
  // See the comment block above for instructions on how to find the right hook.
  const birthDate = '2026-06-09';

  return (
    // min-h-screen: makes the page at least as tall as the screen.
    // bg-app: uses the app's warm cream background colour (defined in styles.css).
    <div className="min-h-screen bg-app">

      {/* Page header — consistent with other screens in the app */}
      <div className="px-5 pt-6 pb-1">
        {/* font-serif uses the Fraunces font defined in styles.css */}
        <h1 className="font-serif text-[26px] font-bold text-foreground leading-tight">
          Milestones
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Week-by-week developmental timeline
        </p>
      </div>

      {/* The timeline component — receives birthDate as its only prop */}
      {/* MilestoneTimeline handles everything from here: filter pills, spine, cards */}
      <MilestoneTimeline birthDate={birthDate} />

    </div>
  );
}
