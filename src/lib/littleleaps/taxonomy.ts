/**
 * taxonomy.ts — the single source of truth for developmental domains.
 *
 * Activities (data.ts) and milestones (milestones.ts) both use this one type
 * and these maps, so the two can never drift apart again. Previously each file
 * had its own domain list (5 vs 8) and they disagreed.
 *
 * Five simplified categories:
 *   sensory          — touch, vision, contrast, tracking (was sensory + visual)
 *   motor            — gross + fine motor
 *   cognitive        — attention, learning
 *   social-language  — social + language/communication
 *   sleep            — sleep architecture, circadian, calming
 *
 * Colours live in src/styles.css as --domain-* tokens (and --color-domain-*
 * for Tailwind's bg-/text-/border-domain-* utilities).
 */

export type Domain = "sensory" | "motor" | "cognitive" | "social-language" | "sleep";

/** Display order used by filter rows and grouped summaries. */
export const DOMAIN_ORDER: Domain[] = ["sensory", "motor", "cognitive", "social-language", "sleep"];

/** Human-readable label. */
export const DOMAIN_LABEL: Record<Domain, string> = {
  sensory: "Sensory",
  motor: "Motor",
  cognitive: "Cognitive",
  "social-language": "Social & Language",
  sleep: "Sleep & Calming",
};

/** Tailwind background class for a small colour dot. */
export const DOMAIN_DOT: Record<Domain, string> = {
  sensory: "bg-domain-sensory",
  motor: "bg-domain-motor",
  cognitive: "bg-domain-cognitive",
  "social-language": "bg-domain-social-language",
  sleep: "bg-domain-sleep",
};

/** Tailwind classes for a tinted badge (bg + text + border). */
export const DOMAIN_BADGE: Record<Domain, string> = {
  sensory: "bg-domain-sensory/15 text-domain-sensory border-domain-sensory/30",
  motor: "bg-domain-motor/15 text-domain-motor border-domain-motor/30",
  cognitive: "bg-domain-cognitive/20 text-domain-cognitive border-domain-cognitive/40",
  "social-language":
    "bg-domain-social-language/15 text-domain-social-language border-domain-social-language/30",
  sleep: "bg-domain-sleep/15 text-domain-sleep border-domain-sleep/30",
};

/** Raw CSS custom property reference — for inline style colours. */
export const DOMAIN_CSS_VAR: Record<Domain, string> = {
  sensory: "var(--domain-sensory)",
  motor: "var(--domain-motor)",
  cognitive: "var(--domain-cognitive)",
  "social-language": "var(--domain-social-language)",
  sleep: "var(--domain-sleep)",
};
