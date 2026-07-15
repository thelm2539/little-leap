/**
 * MilestoneCard.tsx
 *
 * A single card in the milestone timeline. Renders as a collapsed summary row
 * (name + domain dot + week range) that expands on tap to reveal six sections:
 * what's happening, what the parent can see, linked activities, research
 * resources, a check-in question, latest research, and an accelerator tip.
 *
 * Used by: MilestoneTimeline.tsx — which renders one MilestoneCard per milestone.
 * Data comes from: milestones.ts — the Milestone type and domain lookup tables.
 */

// useState is React's tool for remembering values that can change inside a component.
// When a useState value changes, React re-renders just that component.
import { useState } from 'react';

// Icons from the lucide-react library already in the project.
// ChevronRight = the little arrow that rotates when the card expands.
// ExternalLink = the icon shown next to each research paper link.
import { ChevronRight, ExternalLink } from 'lucide-react';

// Import the data types and lookup tables we need from milestones.ts.
// 'type Milestone' is TypeScript-only — it's erased at runtime, just used for checking.
import {
  type Milestone,   // Blueprint: what fields every milestone object must have
  DOMAIN_LABELS,    // Maps domain key → display name e.g. 'gross-motor' → 'Gross Motor'
  DOMAIN_CSS_VAR,   // Maps domain key → CSS var e.g. 'visual' → 'var(--domain-visual)'
} from '../lib/littleleaps/milestones';
// '../' means: go up one folder (out of components/) before looking for lib/


// ─── Props ────────────────────────────────────────────────────────────────────
// Props are the inputs you pass INTO a component — like function arguments.
// We define an interface (blueprint) for the props so TypeScript can catch mistakes.
interface MilestoneCardProps {
  milestone: Milestone;       // The full milestone data object to display
  /**
   * If true, the card starts already expanded.
   * MilestoneTimeline sets this to true for milestones in the current week.
   */
  defaultExpanded?: boolean;  // The ? means this prop is optional — defaults to false below
}


// ─── Component ────────────────────────────────────────────────────────────────
// 'export' makes this function available to other files that import it.
// The { milestone, defaultExpanded = false } syntax destructures the props object
// and sets a default of false for defaultExpanded if none is passed.
export function MilestoneCard({ milestone, defaultExpanded = false }: MilestoneCardProps) {

  // Track whether the card is open or closed.
  // useState(defaultExpanded) sets the starting value.
  // expanded = the current value (true/false)
  // setExpanded = the function to change it (calling this triggers a re-render)
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Look up the CSS colour variable and display label for this milestone's domain.
  // e.g. if domain = 'gross-motor':
  //   domainColor = 'var(--domain-gross-motor)'  (the terracotta orange)
  //   domainLabel = 'Gross Motor'
  const domainColor = DOMAIN_CSS_VAR[milestone.domain];
  const domainLabel = DOMAIN_LABELS[milestone.domain];

  // Build the week range label for the collapsed header.
  // Birth milestones (week 0 to 2) get a special label rather than "Wks 0–2".
  // The ? : syntax is a ternary — shorthand for if/else on one line.
  const weekLabel =
    milestone.weekStart === 0 && milestone.weekEnd <= 2
      ? 'Birth'
      : `Wks ${milestone.weekStart}–${milestone.weekEnd}`;


  // ─── Render ───────────────────────────────────────────────────────────────
  // Everything inside return() is JSX — it looks like HTML but lives in TypeScript.
  // Key difference from HTML: use className instead of class (class is a reserved word in JS).
  // Tailwind utility classes handle all the styling (no separate CSS file needed).
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">

      {/* ── Collapsed header — always visible ── */}
      {/*
        This is a <button> element so it receives tap/click events.
        onClick runs the arrow function: v => !v flips the boolean (true→false, false→true).
        setExpanded stores the new value and React re-renders the card.
      */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-3 pt-3 pb-3 flex items-start justify-between gap-2"
      >
        {/* Left side: milestone name + domain info row */}
        <div className="flex-1 min-w-0">

          {/* Milestone name in bold */}
          <p className="text-sm font-semibold text-foreground leading-snug mb-1">
            {milestone.name}
          </p>

          {/* Domain dot · domain label · week range — small metadata row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/*
              The domain colour dot uses an inline style (not a Tailwind class)
              because the colour is dynamic — it changes per domain.
              Tailwind scans for literal class names at build time, so a dynamically
              built string like `bg-domain-${domain}` would be stripped out.
              Inline style always works regardless of the value.
            */}
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: domainColor }}
            />
            <span className="text-xs text-muted-foreground">{domainLabel}</span>
            {/* aria-hidden means screen readers skip this decorative separator */}
            <span className="text-xs text-muted-foreground" aria-hidden>·</span>
            <span className="text-xs text-muted-foreground">{weekLabel}</span>
          </div>
        </div>

        {/* Chevron arrow on the right — rotates 90° when the card is expanded */}
        <ChevronRight
          className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
          aria-hidden // Decorative icon — screen readers don't need to announce it
        />
      </button>


      {/* ── Expanded body — only renders when expanded is true ── */}
      {/*
        In JSX: {condition && <Element />} is "conditional rendering".
        If expanded is false, nothing is rendered here at all (the element doesn't exist in the DOM).
        If expanded is true, the full detail section renders.
      */}
      {expanded && (
        <div className="border-t border-border px-3 py-3 space-y-3.5">

          {/* 1. What's happening — the neuroscience/development mechanism */}
          <Section label="What's happening">
            <p className="text-[11.5px] text-foreground/75 leading-relaxed">
              {milestone.mechanism}
            </p>
          </Section>

          {/* 2. What the parent can observe at home */}
          <Section label="Parent can see">
            <ul className="space-y-1">
              {/*
                .map() iterates over the array and returns one <li> per item.
                The key prop is required by React for lists — it lets React efficiently
                update only changed items rather than re-rendering the whole list.
                Using the index (i) as key is fine here since the list never reorders.
              */}
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

          {/* 3. Activities — only render this section if there are any activity IDs */}
          {/*
            milestone.activityIds.length > 0 checks if the array has any items.
            If it's empty, the whole Section is skipped.
          */}
          {milestone.activityIds.length > 0 && (
            <Section label="Activities">
              <div className="flex flex-wrap gap-1.5">
                {milestone.activityIds.map(id => (
                  <span
                    key={id}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-secondary
                               text-secondary-foreground border border-border font-medium"
                  >
                    {/* Replace hyphens with spaces for readability: 'tummy-time' → 'tummy time' */}
                    {id.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* 4. Research resources — paper titles as clickable DOI links */}
          <Section label="Resources">
            <div className="space-y-0.5">
              {milestone.resources.map((r, i) => (
                <a
                  key={i}
                  // Template literal builds the full URL from the DOI string
                  href={`https://doi.org/${r.doi}`}
                  target="_blank"           // Open link in a new browser tab
                  rel="noopener noreferrer" // Security: prevents the new tab accessing window.opener
                  className="flex items-start gap-1 text-[10.5px] underline leading-relaxed
                             hover:opacity-70 transition-opacity"
                  // Use the visual (teal) domain colour for all resource links
                  style={{ color: DOMAIN_CSS_VAR['visual'] }}
                >
                  <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" aria-hidden />
                  {r.title}
                </a>
              ))}
            </div>
          </Section>

          {/* 5. Check-in question — shown as a soft italic quote box */}
          <Section label="Check-in">
            <div className="bg-secondary/50 rounded-lg px-2.5 py-2 text-[11.5px]
                            text-foreground/75 italic leading-relaxed">
              "{milestone.checkIn}"
            </div>
          </Section>

          {/* 6. Latest research — only shown if the field has content */}
          {/*
            milestone.latestResearch is a string. An empty string ("") is falsy in JS,
            so this section only renders when the research agent has added content.
          */}
          {milestone.latestResearch && (
            <Section label="Latest research">
              <div className="bg-secondary/30 rounded-lg px-2.5 py-2 text-[11.5px]
                              text-foreground/75 leading-relaxed">
                {milestone.latestResearch}
              </div>
            </Section>
          )}

          {/* 7. Accelerator — tip for if the parent notices early development */}
          <Section label="Accelerator">
            <div className="bg-accent/60 rounded-lg px-2.5 py-2 text-[11.5px]
                            text-accent-foreground leading-relaxed">
              {milestone.accelerator}
            </div>
          </Section>

        </div>
      )}
    </div>
  );
}


// ─── Section helper component ─────────────────────────────────────────────────
/**
 * A tiny internal layout component used only inside MilestoneCard.
 * Wraps any content with a consistent small uppercase label above it.
 *
 * Why a separate component? The expanded body has 7 sections, all needing the
 * same label style. Without this helper we'd repeat the <p className="..."> 7 times.
 * This keeps the code DRY (Don't Repeat Yourself).
 *
 * Not exported — it's only used within this file.
 *
 * 'children' is a special React prop: it holds whatever you put between the
 * opening and closing tags: <Section label="x">THIS IS CHILDREN</Section>
 * React.ReactNode means "anything that can be rendered" — text, elements, etc.
 */
function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Small uppercase spaced label — "WHAT'S HAPPENING", "RESOURCES", etc. */}
      <p className="text-[9.5px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </p>
      {/* Render whatever content was passed between the Section tags */}
      {children}
    </div>
  );
}
