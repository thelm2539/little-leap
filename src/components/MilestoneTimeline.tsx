/**
 * MilestoneTimeline.tsx
 *
 * The full vertical timeline. Renders a scrollable list of week groups,
 * each with a dot on a vertical spine and one or more MilestoneCards.
 * Also renders a row of domain filter pills at the top.
 *
 * Receives the baby's birth date as a prop, calculates the current age in
 * weeks, and uses that to:
 *   - Position a "now" indicator on the current week node
 *   - Auto-expand cards in the current week
 *   - Fade out past milestones (> 3 weeks ago) and far-future ones (> 10 weeks ahead)
 *
 * Used by: activities.tsx (the page/route that holds the whole screen)
 * Uses: MilestoneCard.tsx + milestones.ts data
 */

// useMemo: runs a calculation and caches the result — only recalculates when
//          its dependencies change. Used here for filtering and grouping milestones.
// useState: tracks which domain filter pill is selected.
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  MILESTONES, // The full array of milestone objects from milestones.ts
  getBabyAgeWeeks, // Helper: birth date ISO string → age in whole weeks
  DOMAIN_LABELS, // Domain key → display name e.g. 'gross-motor' → 'Gross Motor'
  DOMAIN_CSS_VAR, // Domain key → CSS variable e.g. 'visual' → 'var(--domain-visual)'
  type MilestoneDomain, // TypeScript type: the union of 7 domain string literals
} from "../lib/littleleaps/milestones";

import { MilestoneCard } from "./MilestoneCard";
import { useActivityLog, receptionByActivity } from "../lib/littleleaps/storage";

// ─── Filter pill definitions ───────────────────────────────────────────────────
// The 'all' option shows every domain. The rest filter to a single domain.
// This array drives the pill row — if you add a new domain, add it here too.
const FILTERS: { key: MilestoneDomain | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sensory", label: "Sensory" },
  { key: "motor", label: "Motor" },
  { key: "cognitive", label: "Cognitive" },
  { key: "social-language", label: "Social & Language" },
  { key: "sleep", label: "Sleep & Calming" },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface MilestoneTimelineProps {
  /**
   * The baby's birth date as an ISO string, e.g. "2026-06-09".
   * Passed in from activities.tsx, which reads it from the user's profile.
   */
  birthDate: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MilestoneTimeline({ birthDate }: MilestoneTimelineProps) {
  // Track which domain filter pill is currently selected.
  const [activeFilter, setActiveFilter] = useState<MilestoneDomain | "all">("all");

  // Calculate the baby's current age in whole weeks from their birth date.
  const currentWeek = getBabyAgeWeeks(birthDate);

  // The living feedback record. Fetched once here (not per-card) and folded into
  // a per-activity reception summary. useActivityLog re-fetches on the
  // "littleleaps:log" event, so a rating logged on any tab updates these cards
  // instantly.
  const { log } = useActivityLog();
  const reception = useMemo(() => receptionByActivity(log), [log]);

  // Navigate to the This Week tab and signal which activity to focus.
  // sessionStorage is used to pass the ID across the navigation boundary.
  const navigate = useNavigate();
  const handleActivityClick = (activityId: string) => {
    sessionStorage.setItem("littleleaps.focusActivity", activityId);
    void navigate({ to: "/this-week" });
  };

  // ── Filter milestones by selected domain ──────────────────────────────────
  // useMemo caches this result and only recalculates when activeFilter changes.
  // Without useMemo this would recalculate on every render — fine at 19 milestones,
  // but good practice as the list grows toward hundreds.
  const filtered = useMemo(() => {
    if (activeFilter === "all") return MILESTONES; // Show everything
    return MILESTONES.filter((m) => m.domain === activeFilter); // Show one domain only
  }, [activeFilter]); // Dependency array: re-run only when activeFilter changes

  // ── Group milestones by peak week ─────────────────────────────────────────
  // Multiple milestones can share the same peak week (e.g. two week-8 milestones).
  // We group them so the timeline shows one week node with multiple cards stacked.
  //
  // A Map is like a Python dict — Map<keyType, valueType>.
  // Here the key is the week number and the value is an array of milestones.
  const weekGroups = useMemo(() => {
    const map = new Map<number, typeof MILESTONES>();

    for (const m of filtered) {
      // If this week number hasn't been seen yet, add an empty array for it.
      if (!map.has(m.weekPeak)) map.set(m.weekPeak, []);
      // Push this milestone into that week's array.
      // The ! after .get() tells TypeScript "this is definitely not undefined"
      // (we just set it with .has() + .set() above, so we know it exists).
      map.get(m.weekPeak)!.push(m);
    }

    // Convert the Map to an array of [week, milestonesArray] pairs,
    // sorted ascending so the timeline reads from week 0 at the top to week 52 at the bottom.
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [filtered]); // Re-run whenever the filtered list changes

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Domain filter pills ── */}
      {/*
        overflow-x-auto: the pill row can scroll horizontally on narrow screens.
        scrollbarWidth: 'none': hides the scrollbar visually (touch/trackpad still scrolls it).
      */}
      <div
        className="flex gap-2 px-5 py-3 overflow-x-auto border-b border-border"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveFilter(key as MilestoneDomain | "all")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border whitespace-nowrap
                        transition-colors flex-shrink-0 ${
                          // Active pill: dark (foreground) background with light text.
                          // Inactive pill: light card background with muted text and a subtle border.
                          activeFilter === key
                            ? "bg-foreground text-background border-foreground"
                            : "bg-card text-muted-foreground border-border hover:border-foreground/30"
                        }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Vertical timeline ── */}
      {/*
        'relative' here is required so we can position the spine line absolutely
        within this container (rather than relative to the whole page).
        pb-28 pads the bottom so cards aren't hidden under the fixed bottom nav bar.
      */}
      <div className="relative px-5 py-5 pb-28">
        {/* The vertical spine line */}
        {/*
          position: absolute places this relative to the parent 'relative' div.
          top-0 and bottom-0 stretch it the full height of the timeline.
          left: '33px' centres it under the week dots.
          w-px = 1px wide. bg-border uses the app's standard border colour.
          aria-hidden: this is purely decorative, screen readers skip it.
        */}
        <div
          className="absolute top-0 bottom-0 w-px bg-border"
          style={{ left: "43px" }}
          aria-hidden
        />

        {/* ── One row per week group ── */}
        {weekGroups.map(([week, milestones], groupIndex) => {
          // How far this week is from the current week.
          // weeksAgo is positive for past groups, weeksAhead for future groups.
          const weeksAgo = currentWeek - week;
          const weeksAhead = week - currentWeek;

          // Opacity fade:
          //   Past (> 3 weeks ago)     → 50% — de-emphasised but still readable
          //   Far future (> 10 weeks)  → 35% — context only, not immediately relevant
          //   Everything else          → 100% — full visibility
          const opacity = weeksAgo > 3 ? 0.5 : weeksAhead > 10 ? 0.35 : 1;

          // Mark this week as "current" if within ±1 week of today.
          // We use a range rather than exact equality because weekPeak is approximate —
          // a milestone peaking at week 8 should still feel "current" at week 7 or 9.
          const isCurrent = Math.abs(week - currentWeek) <= 1;

          return (
            <div
              key={week}
              className="flex items-start"
              style={{ opacity }} // Apply the fade effect
            >
              {/* ── Left column: week dot + label ── */}
              {/*
                z-10 puts this above the absolute-positioned spine line.
                flex-shrink-0 prevents this column from squishing when space is tight.
                width 46px is enough to display "Wk 52" without overflow.
              */}
              <div
                className="flex flex-col items-center pt-3 flex-shrink-0 relative z-10"
                style={{ width: "46px" }}
              >
                {/* The dot on the spine */}
                <div
                  className={`rounded-full border-2 border-background flex-shrink-0 mb-1 ${
                    isCurrent
                      ? "w-3.5 h-3.5 bg-primary" // Current: 14px, sage green
                      : "w-2.5 h-2.5 bg-border" // Other: 10px, muted grey
                  }`}
                  style={
                    isCurrent
                      ? // Soft glow ring using the primary sage green at 20% opacity
                        { boxShadow: "0 0 0 3px oklch(0.58 0.06 150 / 0.2)" }
                      : undefined
                  }
                />

                {/* Week label below the dot */}
                <span
                  className={`text-[10px] font-semibold leading-none text-center ${
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {week === 0 ? "Birth" : `Wk ${week}`}
                </span>

                {/* "now" label — only shown on the current week */}
                {isCurrent && (
                  <span className="text-[9px] text-primary font-medium leading-none mt-0.5">
                    now
                  </span>
                )}
              </div>

              {/* ── Right column: milestone cards ── */}
              {/*
                flex-1 takes all remaining width after the 46px left column.
                space-y-2 adds a small gap between multiple cards in the same week.
                pl-3 adds left padding so cards don't touch the spine.
              */}
              <div className="flex-1 pb-5 pt-2 pl-3 space-y-2">
                {milestones.map((m) => (
                  <MilestoneCard
                    key={m.id}
                    milestone={m}
                    reception={reception}
                    defaultExpanded={
                      isCurrent &&
                      groupIndex === weekGroups.findIndex(([w]) => Math.abs(w - currentWeek) <= 1)
                    }
                    onActivityClick={handleActivityClick}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state — displayed when filtering to a domain with no milestones */}
        {weekGroups.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No milestones in this domain yet.
          </div>
        )}
      </div>
    </div>
  );
}
