import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/littleleaps/AppShell";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ACTIVITIES, formatDuration, type Activity } from "@/lib/littleleaps/data";
import {
  DomainBadge,
  DurationPill,
  NewBadge,
  RatingButtons,
} from "@/components/littleleaps/ActivityBits";
import { getAge, dobFormatted } from "@/lib/littleleaps/age";
import { useBirthDate, useBabyName } from "@/lib/littleleaps/storage";
import {
  getActivitiesForWeek,
  getNewActivityIds,
  getWeekExpectations,
  DOMAIN_LABELS,
  DOMAIN_CSS_VAR,
} from "@/lib/littleleaps/milestones";
import { FlaskConical } from "lucide-react";

export const Route = createFileRoute("/this-week")({
  head: () => ({
    meta: [
      { title: "This Week — Little Leaps" },
      { name: "description", content: "What to expect and what to try this week." },
    ],
  }),
  component: ThisWeek,
});

function ThisWeek() {
  const { birthDate } = useBirthDate();
  const { babyName } = useBabyName();

  // Read the deep-link target from sessionStorage (set by MilestoneTimeline when an
  // activity pill is tapped). Read + clear synchronously so state is correct on first render.
  const [focusedActivity] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const id = sessionStorage.getItem("littleleaps.focusActivity");
    if (id) sessionStorage.removeItem("littleleaps.focusActivity");
    return id;
  });

  // Scroll to and expand the focused activity after the DOM has rendered.
  useEffect(() => {
    if (!focusedActivity) return;
    const el = document.getElementById(`activity-${focusedActivity}`);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [focusedActivity]);

  if (!birthDate) return null;

  const { weeks } = getAge(birthDate);

  // Use milestone-based activity selection instead of the static weekRecommended field.
  // This ensures every week has a meaningful set of activities derived from active milestones.
  const activityIds = getActivitiesForWeek(weeks);
  const activities = activityIds
    .map((id) => ACTIVITIES.find((a) => a.id === id))
    .filter((a): a is Activity => a !== undefined);

  // Same set the Home "New this week" stat uses — see getNewActivityIds.
  const newActivityIds = getNewActivityIds(weeks);

  // "What to expect" is derived from the milestones active this week, grouped by
  // domain — so it tracks the baby's age and matches the Milestones timeline.
  const expectations = getWeekExpectations(weeks);

  return (
    <AppShell>
      <div className="space-y-6 px-5 pt-5">
        <header>
          {babyName && (
            <p className="font-serif text-lg font-semibold tracking-tight text-foreground/80">
              {babyName}
            </p>
          )}
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Week {weeks}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Born {dobFormatted(birthDate)}</p>
        </header>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What to expect this week
          </h2>
          {expectations.length === 0 ? (
            <Card className="rounded-3xl border-border/60 bg-cream/40 p-5 shadow-none">
              <p className="text-sm text-muted-foreground">
                No new milestone windows are opening this exact week — keep following{" "}
                {babyName ?? "your baby"}
                's cues. The timeline on the Milestones tab shows what's next.
              </p>
            </Card>
          ) : (
            <Card className="rounded-3xl border-border/60 p-2 shadow-none">
              <Accordion type="single" collapsible className="w-full">
                {expectations.map(({ domain, milestones }) => (
                  <AccordionItem
                    key={domain}
                    value={domain}
                    className="border-border/60 last:border-b-0"
                  >
                    <AccordionTrigger className="px-3 text-left text-sm font-medium hover:no-underline">
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: DOMAIN_CSS_VAR[domain] }}
                        />
                        {DOMAIN_LABELS[domain]}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 px-3 text-sm leading-relaxed text-foreground/80">
                      {milestones.map((m) => (
                        <div key={m.id}>
                          <p className="font-medium text-foreground">{m.name}</p>
                          <p className="mt-0.5 text-foreground/70">{m.mechanism}</p>
                          {m.parentCanSee.length > 0 && (
                            <ul className="mt-1.5 space-y-1">
                              {m.parentCanSee.map((sign, i) => (
                                <li
                                  key={i}
                                  className="relative pl-3 before:absolute before:left-0 before:text-muted-foreground before:content-['·']"
                                >
                                  {sign}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            This week's activities
            <span className="ml-2 font-normal normal-case text-muted-foreground/70">
              ({activities.length})
            </span>
          </h2>

          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No activities found for this week yet.
            </p>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <Card
                  key={a.id}
                  id={`activity-${a.id}`}
                  className="rounded-3xl border-border/60 p-2 shadow-none"
                >
                  <Accordion
                    type="single"
                    collapsible
                    // Auto-expand if this activity was deep-linked from Milestones tab
                    defaultValue={focusedActivity === a.id ? a.id : undefined}
                  >
                    <AccordionItem value={a.id} className="border-b-0">
                      <AccordionTrigger className="px-3 py-3 text-left hover:no-underline">
                        <div className="flex-1 pr-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-serif text-base font-semibold text-foreground">
                              {a.title}
                            </div>
                            {newActivityIds.has(a.id) && <NewBadge />}
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <DomainBadge domain={a.domain} />
                            <DurationPill duration={formatDuration(a.durationMinutes)} />
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 px-3 pb-4">
                        <div>
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            How to
                          </p>
                          <ol className="space-y-1.5">
                            {a.instructions.map((step, i) => (
                              <li
                                key={i}
                                className="flex gap-2 text-sm leading-relaxed text-foreground/85"
                              >
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cream-dark text-[10px] font-semibold text-foreground/70">
                                  {i + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            What this supports
                          </p>
                          <p className="text-sm leading-relaxed text-foreground/85">
                            {a.processSupported}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-sage/20 bg-sage/5 p-3">
                          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-sage">
                            <FlaskConical size={12} />
                            The science
                          </div>
                          <p className="text-sm leading-relaxed text-foreground/80">
                            {a.evidenceBasis}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Why it works
                          </p>
                          <p className="text-sm leading-relaxed text-foreground/75">
                            {a.whyItWorks}
                          </p>
                        </div>
                        <div>
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Log it
                          </p>
                          <RatingButtons activityId={a.id} compact />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              ))}
            </div>
          )}
        </section>

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
