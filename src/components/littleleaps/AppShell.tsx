/**
 * AppShell.tsx
 *
 * The persistent layout shell that wraps every page.
 * Provides:
 *   - Sticky header with the Little Leaps logo and a birth-date edit button
 *   - <main> area that renders the current page (either children or <Outlet />)
 *   - Fixed bottom navigation bar with four tabs
 *   - BirthDateGate — blocking dialog on first run; edit dialog from the header button
 *   - FamilyKeyGate — blocking dialog until the user sets a family code
 *   - Toaster — toast notification container
 *
 * Responsive:
 *   - Mobile (< 768px): 420px max-width, centred
 *   - Desktop (≥ 768px): 672px max-width (md:max-w-2xl)
 *   - The fixed nav tracks the same max-width so it stays aligned with the content
 */

import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, CalendarDays, Sparkles, MessageCircleQuestion, Sprout, Pencil } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

// ─── Tab definitions ──────────────────────────────────────────────────────────
// Each tab maps to a route file in src/routes/.
// 'exact' means only match if the path is exactly "/" (not "/something-else")
type Tab = { to: "/" | "/this-week" | "/activities" | "/ask"; label: string; icon: typeof Home; exact?: boolean };
const TABS: Tab[] = [
  { to: "/",            label: "Home",      icon: Home,                   exact: true },
  { to: "/this-week",  label: "This Week",  icon: CalendarDays },
  { to: "/activities", label: "Milestones", icon: Sparkles },
  { to: "/ask",        label: "Ask",        icon: MessageCircleQuestion },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function AppShell({ children }: { children?: ReactNode }) {
  // Track the current URL so we can highlight the active tab
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-app">

      {/* ── Content column ── */}
      {/* max-w-[420px] on mobile, md:max-w-2xl (672px) on desktop */}
      <div className="mx-auto flex min-h-screen max-w-[420px] md:max-w-2xl flex-col bg-background shadow-sm">

        {/* ── Sticky header ── */}
        <header className="flex items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-5 py-4 backdrop-blur sticky top-0 z-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage/15 text-sage">
              <Sprout size={18} />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
              Little Leaps
            </span>
          </div>

          {/* Edit birth date button — small pencil icon in the top-right */}
          {/*
            onClick opens the BirthDateGate in edit mode.
            aria-label makes it accessible to screen readers.
          */}
          {/* Pencil icon dispatches a custom event that BirthDateGate (in __root.tsx) listens for.
              Using an event keeps AppShell and BirthDateGate decoupled — no shared state needed. */}
          <button
            type="button"
            aria-label="Edit baby's birth date"
            onClick={() => window.dispatchEvent(new CustomEvent("littleleaps:editBirthDate"))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground
                       hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Pencil size={15} />
          </button>
        </header>

        {/* ── Page content ── */}
        {/* pb-24 ensures content isn't hidden under the fixed nav bar */}
        <main className="flex-1 pb-24">{children ?? <Outlet />}</main>

        {/* ── Bottom navigation ── */}
        {/*
          fixed bottom-0: sticks to the bottom of the viewport (not the column).
          left-1/2 + -translate-x-1/2: centres the fixed nav horizontally.
          max-w-[420px] md:max-w-2xl: matches the content column width exactly.
        */}
        <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[420px] md:max-w-2xl -translate-x-1/2 border-t border-border/60 bg-background/95 backdrop-blur">
          <ul className="grid grid-cols-4">
            {TABS.map((t) => {
              const Icon = t.icon;
              // Active = exact path match for home, startsWith for other tabs
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              return (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    className={`flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                      active ? "text-sage" : "text-muted-foreground"
                    }`}
                  >
                    {/* Slightly bolder stroke on the active icon */}
                    <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* OnboardingGate (in __root.tsx) handles first-run setup — no gate needed here */}

      {/* ── Toast notifications ── */}
      <Toaster position="top-center" />
    </div>
  );
}
