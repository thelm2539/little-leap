/**
 * MilestoneCard.tsx
 *
 * A single card in the milestone timeline. Renders as a collapsed summary row
 * (name + domain dot + week range) that expands on tap to reveal:
 *   - What's happening (mechanism)
 *   - What the parent can observe at home
 *   - Activities (pills that navigate to This Week tab)
 *   - Resources (DOI links)
 *   - Latest research
 *
 * Check-in and Accelerator sections are kept in the data (milestones.ts) but
 * not rendered here — they'll be used in a future feature.
 *
 * Used by: MilestoneTimeline.tsx
 * Data comes from: milestones.ts
 */

import { useState } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import {
  type Milestone,
  DOMAIN_LABELS,
  DOMAIN_CSS_VAR,
} from '../lib/littleleaps/milestones';
import { ACTIVITIES } from '../lib/littleleaps/data';


// ─── Props ────────────────────────────────────────────────────────────────────
interface MilestoneCardProps {
  milestone: Milestone;
  /** If true, the card starts already expanded. */
  defaultExpanded?: boolean;
  /**
   * Called when an activity pill is tapped.
   * MilestoneTimeline provides this to navigate to the This Week tab.
   */
  onActivityClick?: (activityId: string) => void;
}


// ─── Component ────────────────────────────────────────────────────────────────
export function MilestoneCard({ milestone, defaultExpanded = false, onActivityClick }: MilestoneCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const domainColor = DOMAIN_CSS_VAR[milestone.domain];
  const domainLabel = DOMAIN_LABELS[milestone.domain];

  const weekLabel =
    milestone.weekStart === 0 && milestone.weekEnd <= 2
      ? 'Birth'
      : `Wks ${milestone.weekStart}–${milestone.weekEnd}`;


  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">

      {/* ── Collapsed header ── */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-3 pt-3 pb-3 flex items-start justify-between gap-2"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug mb-1">
            {milestone.name}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: domainColor }}
            />
            <span className="text-xs text-muted-foreground">{domainLabel}</span>
            <span className="text-xs text-muted-foreground" aria-hidden>·</span>
            <span className="text-xs text-muted-foreground">{weekLabel}</span>
          </div>
        </div>

        <ChevronRight
          className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
          aria-hidden
        />
      </button>


      {/* ── Expanded body ── */}
      {expanded && (
        <div className="border-t border-border px-3 py-3 space-y-3.5">

          {/* 1. What's happening */}
          <Section label="What's happening">
            <p className="text-[11.5px] text-foreground/75 leading-relaxed">
              {milestone.mechanism}
            </p>
          </Section>

          {/* 2. What the parent can observe */}
          <Section label="Parent can see">
            <ul className="space-y-1">
              {milestone.parentCanSee.map((sign, i) => (
                <li
                  key={i}
                  className="text-[11.5px] text-foreground/75 leading-relaxed pl-3 relative
                             before:content-['·'] before:absolute before:left-0 before:text-muted-foreground"
                >
                  {sign}
                </li>
              ))}
            </ul>
          </Section>

          {/* 3. Activities — clickable pills that deep-link to This Week tab */}
          {milestone.activityIds.length > 0 && (
            <Section label="Activities">
              <div className="flex flex-wrap gap-1.5">
                {milestone.activityIds.map(id => {
                  const activity = ACTIVITIES.find(a => a.id === id);
                  const title = activity?.title ?? id.replace(/-/g, ' ');
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onActivityClick?.(id)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-medium
                                  bg-secondary text-secondary-foreground border-border
                                  ${onActivityClick
                                    ? 'hover:bg-sage/15 hover:border-sage/40 hover:text-foreground transition-colors cursor-pointer'
                                    : 'cursor-default'
                                  }`}
                    >
                      {title}
                    </button>
                  );
                })}
              </div>
              {onActivityClick && (
                <p className="mt-1.5 text-[9px] text-muted-foreground">
                  Tap an activity to find it in This Week
                </p>
              )}
            </Section>
          )}

          {/* 4. Research resources */}
          <Section label="Resources">
            <div className="space-y-0.5">
              {milestone.resources.map((r, i) => (
                <a
                  key={i}
                  href={`https://doi.org/${r.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1 text-[10.5px] underline leading-relaxed
                             hover:opacity-70 transition-opacity"
                  style={{ color: DOMAIN_CSS_VAR['visual'] }}
                >
                  <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" aria-hidden />
                  {r.title}
                </a>
              ))}
            </div>
          </Section>

          {/* 5. Latest research — only if populated */}
          {milestone.latestResearch && (
            <Section label="Latest research">
              <div className="bg-secondary/30 rounded-lg px-2.5 py-2 text-[11.5px]
                              text-foreground/75 leading-relaxed">
                {milestone.latestResearch}
              </div>
            </Section>
          )}

          {/*
            Check-in and Accelerator are intentionally not rendered here.
            Data is preserved in milestones.ts (milestone.checkIn, milestone.accelerator)
            for a future coaching/check-in feature.
          */}

        </div>
      )}
    </div>
  );
}


// ─── Section helper ───────────────────────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9.5px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}
