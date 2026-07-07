/**
 * export-activity-manifest.ts
 *
 * Serialises the ACTIVITIES array from src/lib/littleleaps/data.ts into a
 * read-only JSON manifest for the Little Leaps research agent.
 *
 * The agent reads this file (path = APP_MANIFEST in its CONFIG) to:
 *   - Match findings to exact activity IDs
 *   - Check new research against live whyItWorks content
 *   - Detect when suggested updates are already reflected in the app
 *
 * OUTPUT:  app-export/activity-manifest.json
 * RUN:     bun run scripts/export-activity-manifest.ts
 * AUTO:    Called as postbuild hook — see package.json "postbuild" script
 *          and .github/workflows/export-manifest.yml
 *
 * ONE-DIRECTIONAL: The agent never writes to this file or to data.ts.
 * Approved agent suggestions flow through human review → data.ts → GitHub → Vercel.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { ACTIVITIES } from "../src/lib/littleleaps/data";

// ── Manifest shape ────────────────────────────────────────────────────────────
// Strip everything the agent doesn't need (instructions, durations, processSupported).
// Keep only what's required to match, compare, and suggest content.

const manifest = {
  exportedAt: new Date().toISOString(),
  activityCount: ACTIVITIES.length,
  activities: ACTIVITIES.map((a) => ({
    id: a.id,
    title: a.title,
    domain: a.domain,
    subDomain: (a as any).subDomain ?? null,   // included once sub-domains are added
    ageWindowWeeks: a.ageWindowWeeks,
    weekRecommended: a.weekRecommended,
    whyItWorks: a.whyItWorks,
    sources: ((a as any).sources ?? []).map(
      (s: { citation: string; url: string }) => s.citation
    ),
    hasShortTermBenefits: Array.isArray((a as any).shortTermBenefits) && (a as any).shortTermBenefits.length > 0,
    hasLongTermBenefits: Array.isArray((a as any).longTermBenefits) && (a as any).longTermBenefits.length > 0,
  })),
};

// ── Write ─────────────────────────────────────────────────────────────────────
const outDir = join(process.cwd(), "app-export");
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "activity-manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2));

console.log(`✓  Exported ${manifest.activityCount} activities → app-export/activity-manifest.json`);
console.log(`   exportedAt: ${manifest.exportedAt}`);
