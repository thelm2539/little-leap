import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/littleleaps/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/lib/littleleaps/data";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask — Little Leaps" },
      { name: "description", content: "Answers to common newborn questions, grounded in science." },
    ],
  }),
  component: AskPage,
});

function AskPage() {
  return (
    <AppShell>
      <div className="space-y-5 px-5 pt-5">
        <header>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Ask</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The most common questions in weeks 1–4, answered.
          </p>
        </header>

        <Card className="rounded-3xl border-border/60 p-2 shadow-none">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="border-border/60 last:border-b-0">
                <AccordionTrigger className="px-3 text-left text-sm font-medium leading-snug hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-3 text-sm leading-relaxed text-foreground/80">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card className="rounded-3xl border-sage/20 bg-sage/8 p-5 shadow-none">
          <h3 className="font-serif text-base font-semibold text-foreground">
            Have a question not listed here?
          </h3>
          <p className="mt-1 text-sm text-foreground/75">Ask Claude directly.</p>
          <Button
            asChild
            className="mt-4 w-full rounded-full bg-sage text-sage-foreground hover:bg-sage/90"
          >
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">
              Open Claude <ExternalLink size={14} className="ml-1.5" />
            </a>
          </Button>
        </Card>

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
