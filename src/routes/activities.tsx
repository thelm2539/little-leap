import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/littleleaps/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  ACTIVITIES,
  type Activity,
  type Domain,
  DOMAIN_LABEL,
  formatDuration,
} from "@/lib/littleleaps/data";
import {
  DomainBadge,
  DomainDot,
  DurationPill,
  RatingBadge,
  RatingButtons,
} from "@/components/littleleaps/ActivityBits";
import { Search, Loader2, FlaskConical, Sparkles, ExternalLink, Heart, Zap, TrendingUp } from "lucide-react";
import { useActivityLog } from "@/lib/littleleaps/storage";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Activities — Little Leaps" },
      { name: "description", content: "Browse evidence-based newborn activities." },
    ],
  }),
  component: ActivitiesPage,
});

type Filter = "all" | Domain;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sensory-motor", label: "Sensory & Motor" },
  { value: "language", label: "Language" },
  { value: "cognitive", label: "Cognitive" },
];

function ActivitiesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Activity | null>(null);
  const { loading, error } = useActivityLog();

  const list = useMemo(() => {
    return ACTIVITIES.filter((a) => filter === "all" || a.domain === filter).filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [filter, query]);

  return (
    <AppShell>
      <div className="space-y-4 px-5 pt-5">
        <header>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Activities
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Evidence-based things to try with your baby.
          </p>
        </header>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities"
            className="h-11 rounded-full border-border/60 bg-cream/40 pl-9"
          />
        </div>

        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-sage text-sage-foreground"
                    : "bg-cream/60 text-foreground/70 hover:bg-cream"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
            <Loader2 size={14} className="animate-spin" /> Loading your ratings…
          </div>
        )}
        {error && !loading && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive">
            Couldn't load your ratings. Check your connection and try again.
          </div>
        )}

        <div className="space-y-3">
          {list.map((a) => (
            <button key={a.id} onClick={() => setOpen(a)} className="w-full text-left">
              <Card className="rounded-2xl border-border/60 p-4 shadow-none transition active:scale-[0.99] hover:bg-cream/30">
                <div className="flex items-start gap-3">
                  <DomainDot domain={a.domain} />
                  <div className="flex-1">
                    <div className="font-serif text-base font-semibold text-foreground">{a.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span>{DOMAIN_LABEL[a.domain]}</span>
                      <span>·</span>
                      <DurationPill duration={formatDuration(a.durationMinutes)} />
                    </div>
                  </div>
                  <RatingBadge activityId={a.id} />
                </div>
              </Card>
            </button>
          ))}
          {list.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">No activities found.</p>
          )}
        </div>
        <div className="h-4" />
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-3xl">
          {open && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="font-serif text-xl">{open.title}</SheetTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <DomainBadge domain={open.domain} />
                  <DurationPill duration={formatDuration(open.durationMinutes)} />
                  <span className="text-xs text-muted-foreground">· Ages {open.ageWindowWeeks} wks</span>
                </div>
                <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-sage/12 px-2.5 py-1 text-[11px] font-medium text-sage">
                  <Sparkles size={12} />
                  Recommended from week {open.weekRecommended}
                </div>
              </SheetHeader>

              <div className="mt-5 space-y-5">
                <section>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    How to
                  </p>
                  <ol className="space-y-2 pl-0">
                    {open.instructions.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream-dark text-[11px] font-semibold text-foreground/70">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    What this supports
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">{open.processSupported}</p>
                </section>

                <section className="rounded-2xl border border-sage/20 bg-sage/5 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-sage">
                    <FlaskConical size={13} />
                    The science
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">{open.evidenceBasis}</p>
                </section>

                <section>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Why it works
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/75">{open.whyItWorks}</p>
                </section>

                <section>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    How did it go?
                  </p>
                  <RatingButtons activityId={open.id} compact />
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
