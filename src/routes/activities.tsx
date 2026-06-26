import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/littleleaps/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ACTIVITIES, type Activity, type Domain, DOMAIN_LABEL } from "@/lib/littleleaps/data";
import {
  DomainBadge,
  DomainDot,
  DurationPill,
  RatingBadge,
  RatingButtons,
} from "@/components/littleleaps/ActivityBits";
import { Search } from "lucide-react";

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
  { value: "sensorimotor", label: "Sensory & Motor" },
  { value: "language", label: "Language" },
  { value: "cognitive", label: "Cognitive" },
];

function ActivitiesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Activity | null>(null);

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

        <div className="space-y-3">
          {list.map((a) => (
            <button
              key={a.id}
              onClick={() => setOpen(a)}
              className="w-full text-left"
            >
              <Card className="rounded-2xl border-border/60 p-4 shadow-none transition active:scale-[0.99] hover:bg-cream/30">
                <div className="flex items-start gap-3">
                  <DomainDot domain={a.domain} />
                  <div className="flex-1">
                    <div className="font-serif text-base font-semibold text-foreground">{a.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span>{DOMAIN_LABEL[a.domain]}</span>
                      <span>·</span>
                      <DurationPill duration={a.duration} />
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
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
          {open && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="font-serif text-xl">{open.title}</SheetTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <DomainBadge domain={open.domain} />
                  <DurationPill duration={open.duration} />
                </div>
              </SheetHeader>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    How to
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">{open.instructions}</p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Why it works
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/75">{open.why}</p>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    How did it go?
                  </p>
                  <RatingButtons activityId={open.id} compact />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
