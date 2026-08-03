import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/littleleaps/AppShell";
import { Card } from "@/components/ui/card";
import { ageLabel, getAge, greeting } from "@/lib/littleleaps/age";
import { ACTIVITIES, formatDuration, type Activity } from "@/lib/littleleaps/data";
import { useBirthDate, useBabyName } from "@/lib/littleleaps/storage";
import { DomainBadge, DurationPill, RatingButtons } from "@/components/littleleaps/ActivityBits";
import { Lightbulb, ArrowRight } from "lucide-react";
import {
  getActivitiesForWeek,
  getNewActivityCount,
  getWeekTip,
} from "@/lib/littleleaps/milestones";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Little Leaps — Home" },
      {
        name: "description",
        content: "Evidence-based weekly development companion for your newborn.",
      },
    ],
  }),
  component: Home,
});

// Awake time → activity count: shorter window = fewer activities to avoid overwhelming
function activitiesForAwakeTime(minutes: number): number {
  return minutes < 45 ? 1 : minutes < 75 ? 2 : 3;
}

function Home() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // All hooks before the early return (React rules of hooks).
  const { birthDate } = useBirthDate();
  const { babyName } = useBabyName();
  const navigate = useNavigate();

  // Open an activity's full detail on the This Week tab. sessionStorage carries
  // the target across the navigation; This Week reads it, scrolls to the card
  // and expands it (same channel the Milestones tab uses).
  const openActivityDetail = (activityId: string) => {
    sessionStorage.setItem("littleleaps.focusActivity", activityId);
    void navigate({ to: "/this-week" });
  };

  // Awake minutes: persisted to localStorage so the slider value survives reloads.
  const [awakeMinutes, setAwakeMinutes] = useState<number>(() => {
    if (typeof window === "undefined") return 60;
    return Number(localStorage.getItem("littleleaps.awakeMinutes") ?? "60");
  });

  const handleAwakeChange = (mins: number) => {
    setAwakeMinutes(mins);
    localStorage.setItem("littleleaps.awakeMinutes", String(mins));
  };

  if (!birthDate) return null;

  const { weeks } = getAge(birthDate, now);

  // ── Activities for this week from active milestone windows ──────────────────
  const activityIds = getActivitiesForWeek(weeks);
  const weekActivities = activityIds
    .map((id) => ACTIVITIES.find((a) => a.id === id))
    .filter((a): a is Activity => a !== undefined);

  // Cycle through by day so the selection changes daily but is stable all day.
  const daysSinceBirth = Math.floor(
    (now.getTime() - new Date(birthDate).getTime()) / (24 * 60 * 60 * 1000),
  );
  const showCount = Math.min(activitiesForAwakeTime(awakeMinutes), weekActivities.length);
  const todayActivities: Activity[] =
    weekActivities.length > 0
      ? Array.from(
          { length: showCount },
          (_, i) => weekActivities[(daysSinceBirth + i) % weekActivities.length],
        )
      : [];

  // ── Stats ───────────────────────────────────────────────────────────────────
  const newActivitiesCount = getNewActivityCount(weeks);

  // ── Weekly tip derived from active milestones ───────────────────────────────
  const weeklyTip = getWeekTip(weeks);

  return (
    <AppShell>
      <div className="space-y-5 px-5 pt-5">
        <section>
          <p className="text-2xl font-serif font-semibold tracking-tight text-foreground">
            {greeting(now)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {babyName ?? "Baby"} is {ageLabel(birthDate, now)}
          </p>
        </section>

        {/* ── Stats row + awake slider ── */}
        <section className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Age" value={`${weeks}w`} />
            <Stat label="Awake today" value={`${awakeMinutes} min`} />
            <Stat label="New this week" value={String(newActivitiesCount)} />
          </div>

          {/* Awake window slider
              Longer window → more activities shown below.
              Shorter window → fewer, so the parent isn't overwhelmed. */}
          <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs text-muted-foreground">Longest awake window</span>
              <span className="text-xs font-semibold text-foreground">{awakeMinutes} min</span>
            </div>
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={awakeMinutes}
              onChange={(e) => handleAwakeChange(Number(e.target.value))}
              className="w-full h-1.5 cursor-pointer rounded-full appearance-none bg-border"
              style={{ accentColor: "var(--sage)" }}
              aria-label="Longest awake window in minutes"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-muted-foreground">15 min</span>
              <span className="text-[9px] text-muted-foreground">2 hr</span>
            </div>
          </div>
        </section>

        {/* ── Today's activities ── */}
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {todayActivities.length === 1 ? "Today's activity" : "Today's activities"}
          </h2>

          {todayActivities.length === 0 ? (
            <Card className="rounded-3xl border-border/60 bg-cream/40 p-5 shadow-none">
              <p className="text-sm text-muted-foreground">
                No activities in the library for this age yet.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayActivities.map((a) => (
                <Card
                  key={a.id}
                  className="rounded-3xl border-border/60 bg-cream/40 p-5 shadow-none"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        {a.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <DomainBadge domain={a.domain} />
                        <DurationPill duration={formatDuration(a.durationMinutes)} />
                      </div>
                    </div>
                  </div>
                  {/* First two steps as a teaser — full activity is in This Week */}
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {a.instructions.slice(0, 2).join(" ")}
                  </p>
                  {/* Learn more → full instructions + the science, on This Week */}
                  <button
                    type="button"
                    onClick={() => openActivityDetail(a.id)}
                    className="mt-3 inline-flex items-center gap-1 rounded-full border border-sage/30 bg-sage/8
                               px-3 py-1 text-xs font-medium text-sage transition-colors hover:bg-sage/15"
                  >
                    Learn more <ArrowRight size={12} />
                  </button>
                  <div className="mt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      How did it go?
                    </p>
                    <RatingButtons activityId={a.id} compact />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── Weekly tip ── */}
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            This week's tip
          </h2>
          <Card className="rounded-3xl border-sage/20 bg-sage/8 p-5 shadow-none">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
                <Lightbulb size={16} />
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">{weeklyTip}</p>
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
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
