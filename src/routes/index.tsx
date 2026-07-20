import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/littleleaps/AppShell";
import { Card } from "@/components/ui/card";
import { ageLabel, getAge, greeting } from "@/lib/littleleaps/age";
import { ACTIVITIES, WEEKLY_TIP, formatDuration } from "@/lib/littleleaps/data";
import { useActivityLog, countThisWeek, useBirthDate } from "@/lib/littleleaps/storage";
import { DomainBadge, DurationPill, RatingButtons } from "@/components/littleleaps/ActivityBits";
import { Lightbulb } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Little Leaps — Home" },
      { name: "description", content: "Evidence-based weekly development companion for your newborn." },
    ],
  }),
  component: Home,
});

function Home() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // All hooks must be called before any conditional return (React rules of hooks).
  // birthDate is null until the user enters one — BirthDateGate handles that case.
  const { birthDate } = useBirthDate();
  const { log } = useActivityLog();

  if (!birthDate) return null;

  const { weeks } = getAge(birthDate, now);
  const weekCount = countThisWeek(log);

  const todayActivity = ACTIVITIES.find((a) => a.id === "slow-face")!;

  return (
    <AppShell>
      <div className="space-y-5 px-5 pt-5">
        <section>
          <p className="text-2xl font-serif font-semibold tracking-tight text-foreground">
            {greeting(now)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Baby is {ageLabel(birthDate, now)}</p>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <Stat label="Age" value={`${weeks}w`} />
          <Stat label="Awake today" value="~75 min" />
          <Stat label="Activities this week" value={String(weekCount)} />
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Today's activity
          </h2>
          <Card className="rounded-3xl border-border/60 bg-cream/40 p-5 shadow-none">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {todayActivity.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <DomainBadge domain={todayActivity.domain} />
                  <DurationPill duration={formatDuration(todayActivity.durationMinutes)} />
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              {todayActivity.instructions.slice(0, 2).join(" ")}
            </p>
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                How did it go?
              </p>
              <RatingButtons activityId={todayActivity.id} compact />
            </div>
          </Card>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            This week's tip
          </h2>
          <Card className="rounded-3xl border-sage/20 bg-sage/8 p-5 shadow-none">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
                <Lightbulb size={16} />
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">{WEEKLY_TIP}</p>
            </div>
          </Card>
        </section>

        <div className="h-4" />
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background px-3 py-3 text-center">
      <div className="font-serif text-lg font-semibold text-foreground">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
