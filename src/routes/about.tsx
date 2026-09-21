/**
 * about.tsx — "About & Sources".
 *
 * Not in the bottom nav (same pattern as /ask) — reached from a link on
 * Profile. Exists to state plainly what this app is, how its content is
 * sourced, and what it isn't: a substitute for medical advice.
 *
 * Deliberately doesn't claim to be "medically reviewed" — that isn't true,
 * and claiming it would be exactly the kind of fabricated authority this
 * project has spent effort removing elsewhere (see the DOI audit,
 * BACKLOG item 7). "Sourced from peer-reviewed literature, cited on every
 * milestone" is the honest version of the same trust signal.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/littleleaps/AppShell";
import { Card } from "@/components/ui/card";
import { BookOpen, Stethoscope, Sprout } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Sources — Little Leaps" },
      {
        name: "description",
        content: "What Little Leaps is, how its content is sourced, and what it isn't.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell>
      <div className="space-y-5 px-5 pt-6">
        <header>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            About & Sources
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">What this app is, and what it isn't.</p>
        </header>

        <Card className="rounded-3xl border-border/60 p-5 shadow-none">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
              <Sprout size={16} />
            </div>
            <div>
              <h2 className="font-serif text-base font-semibold text-foreground">
                What Little Leaps is
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                A week-by-week guide to newborn development — activities and milestones grounded in
                developmental science, built to help you notice what's happening and try things that
                support it.
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 p-5 shadow-none">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="font-serif text-base font-semibold text-foreground">
                How the content is sourced
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                Every milestone cites primary, peer-reviewed research — not secondary summaries.
                Each citation on the Milestones tab links directly to the paper via its DOI, so you
                can read the source yourself rather than take our word for it.
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-sage/20 bg-sage/8 p-5 shadow-none">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
              <Stethoscope size={16} />
            </div>
            <div>
              <h2 className="font-serif text-base font-semibold text-foreground">
                What this isn't
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                This app is educational, not medical advice, and it isn't reviewed by a
                pediatrician. The ages shown are typical ranges, not deadlines — every baby develops
                at their own pace, and normal variation is wide. If you're ever concerned about your
                baby's development, talk to your pediatrician; they know your baby, this app
                doesn't.
              </p>
            </div>
          </div>
        </Card>

        <p className="px-1 text-center text-xs text-muted-foreground">
          <Link to="/profile" className="text-sage hover:underline">
            Back to Profile
          </Link>
        </p>

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
