/**
 * ActivityReceptionGrid.tsx
 *
 * "What {baby}'s enjoying, week by week" — one square per (domain, week),
 * coloured by that week's most recent rating for that kind of play. Lets a
 * type of activity's trajectory read at a glance (e.g. Motor play was fussy
 * around week 2, settled by week 5) instead of being buried in an aggregate.
 *
 * Data: buildReceptionGrid()/describeReceptionTrends() in storage.ts, built
 * from the same activity_logs the rest of the app already fetches — no extra
 * query, no DB change. See those functions for the aggregation rules (most
 * recent rating wins per cell; domain re-derived from the activity's current
 * classification, not the label frozen on the log row).
 *
 * Lives on the Home tab, above "Today's activities".
 */

import { Fragment } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { DOMAIN_LABEL, DOMAIN_CSS_VAR } from "@/lib/littleleaps/taxonomy";
import { RATING_LABEL } from "./ActivityBits";
import {
  useActivityLog,
  useBabyName,
  buildReceptionGrid,
  describeReceptionTrends,
  type WeekCell,
  type Rating,
} from "@/lib/littleleaps/storage";

// Tailwind's scanner needs literal class strings — a template literal like
// `bg-rating-${rating}` won't be picked up, so the mapping is spelled out here.
const RATING_BG_CLASS: Record<Rating, string> = {
  engaged: "bg-rating-engaged",
  neutral: "bg-rating-neutral",
  fussy: "bg-rating-fussy",
};

export function ActivityReceptionGrid() {
  const { log, loading } = useActivityLog();
  const { babyName } = useBabyName();

  if (loading) return null;

  const grid = buildReceptionGrid(log);
  const title = babyName
    ? `What ${babyName}'s enjoying, week by week`
    : "What your baby's enjoying, week by week";

  return (
    <section className="space-y-2">
      <SectionLabel>Activity trends</SectionLabel>
      <Card className="rounded-3xl border-border/60 p-5 shadow-none">
        <h3 className="font-serif text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Each square is one week of that kind of play.
        </p>

        {grid.weeks.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">
            Rate a few activities on Home or This Week and you'll start seeing patterns here.
          </p>
        ) : (
          <>
            <div className="mt-5 -mx-1 overflow-x-auto px-1">
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `76px repeat(${grid.weeks.length}, 26px)` }}
              >
                <div className="sticky left-0 z-10 bg-background" />
                {grid.weeks.map((w) => (
                  <div
                    key={w}
                    className="text-center text-[10px] tabular-nums text-muted-foreground"
                  >
                    {w}
                  </div>
                ))}

                {grid.rows.map((row) => (
                  <Fragment key={row.domain}>
                    <div className="sticky left-0 z-10 flex items-center gap-1.5 bg-background pr-2 text-[11px] leading-tight text-foreground">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: DOMAIN_CSS_VAR[row.domain] }}
                      />
                      {DOMAIN_LABEL[row.domain]}
                    </div>
                    {grid.weeks.map((w) => (
                      <Cell
                        key={w}
                        cell={row.cells.get(w)!}
                        domainLabel={DOMAIN_LABEL[row.domain]}
                        week={w}
                      />
                    ))}
                  </Fragment>
                ))}
              </div>
              <p className="mt-1.5 pr-1 text-right text-[10px] text-muted-foreground">week</p>
            </div>

            <Legend />

            <div className="mt-4 rounded-2xl border border-sage/20 bg-sage/8 p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-sage">
                What this shows
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">
                {describeReceptionTrends(grid)}
              </p>
            </div>
          </>
        )}
      </Card>
    </section>
  );
}

function Cell({ cell, domainLabel, week }: { cell: WeekCell; domainLabel: string; week: number }) {
  if (cell.rating === null) {
    return (
      <button
        type="button"
        className="h-[26px] w-[26px] rounded-[6px] border border-dashed border-border/70"
        aria-label={`Week ${week}, ${domainLabel}: no activities logged`}
        onClick={() =>
          toast(`${domainLabel} · Week ${week}`, { description: "Quiet week — nothing logged." })
        }
      />
    );
  }
  return (
    <button
      type="button"
      className={`h-[26px] w-[26px] rounded-[6px] ${RATING_BG_CLASS[cell.rating]}`}
      aria-label={`Week ${week}, ${domainLabel}: ${RATING_LABEL[cell.rating]}, ${cell.count} ${cell.count === 1 ? "activity" : "activities"}`}
      onClick={() =>
        toast(`${domainLabel} · Week ${week}`, {
          description: `${RATING_LABEL[cell.rating!]} · ${cell.count} ${cell.count === 1 ? "activity" : "activities"} logged`,
        })
      }
    />
  );
}

function Legend() {
  const items: { key: Rating | "quiet"; label: string }[] = [
    { key: "engaged", label: "Engaged" },
    { key: "neutral", label: "Neutral" },
    { key: "fussy", label: "Fussy" },
    { key: "quiet", label: "Quiet week" },
  ];
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/60 pt-3">
      {items.map((item) => (
        <span
          key={item.key}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
        >
          {item.key === "quiet" ? (
            <span className="h-2.5 w-2.5 rounded-[3px] border border-dashed border-border" />
          ) : (
            <span className={`h-2.5 w-2.5 rounded-[3px] ${RATING_BG_CLASS[item.key]}`} />
          )}
          {item.label}
        </span>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}
