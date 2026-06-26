import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/littleleaps/AppShell";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ACTIVITIES, WEEK_EXPECTATIONS, formatDuration } from "@/lib/littleleaps/data";
import { DomainBadge, DurationPill, RatingButtons } from "@/components/littleleaps/ActivityBits";
import { getAge } from "@/lib/littleleaps/age";
import { dobFormatted } from "@/lib/littleleaps/age";
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
  const { weeks } = getAge();
  const activities = ACTIVITIES.filter((a) => a.weekRecommended === weeks);

  return (
    <AppShell>
      <div className="space-y-6 px-5 pt-5">
        <header>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Week {weeks} Report
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Born {dobFormatted()}</p>
        </header>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Check-in summary
          </h2>
          <Card className="rounded-3xl border-border/60 bg-cream/50 p-4 shadow-none">
            <div className="grid grid-cols-2 gap-3">
              <SummaryItem label="Weight" value="On track" />
              <SummaryItem label="Awake windows" value="60–90 min/day" />
              <SummaryItem label="Tummy time" value="2–4 min sessions" />
              <SummaryItem label="Head control" value="Lifting briefly" />
            </div>
          </Card>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What to expect this week
          </h2>
          <Card className="rounded-3xl border-border/60 p-2 shadow-none">
            <Accordion type="single" collapsible className="w-full">
              {WEEK_EXPECTATIONS.map((item) => (
                <AccordionItem key={item.title} value={item.title} className="border-border/60 last:border-b-0">
                  <AccordionTrigger className="px-3 text-left text-sm font-medium hover:no-underline">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 text-sm leading-relaxed text-foreground/80">
                    {item.body}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            This week's activities
          </h2>
          <div className="space-y-3">
            {activities.map((a) => (
              <Card key={a.id} className="rounded-3xl border-border/60 p-2 shadow-none">
                <Accordion type="single" collapsible>
                  <AccordionItem value={a.id} className="border-b-0">
                    <AccordionTrigger className="px-3 py-3 text-left hover:no-underline">
                      <div className="flex-1 pr-3">
                        <div className="font-serif text-base font-semibold text-foreground">
                          {a.title}
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
                            <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
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
                        <p className="text-sm leading-relaxed text-foreground/85">{a.processSupported}</p>
                      </div>
                      <div className="rounded-2xl border border-sage/20 bg-sage/5 p-3">
                        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-sage">
                          <FlaskConical size={12} />
                          The science
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80">{a.evidenceBasis}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Why it works
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/75">{a.whyItWorks}</p>
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
        </section>

        <div className="h-4" />
      </div>
    </AppShell>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/80 p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
