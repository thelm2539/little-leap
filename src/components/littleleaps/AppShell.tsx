import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, CalendarDays, Sparkles, MessageCircleQuestion, Sprout } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

const TABS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/this-week", label: "This Week", icon: CalendarDays },
  { to: "/activities", label: "Activities", icon: Sparkles },
  { to: "/ask", label: "Ask", icon: MessageCircleQuestion },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-app">
      <div className="mx-auto flex min-h-screen max-w-[420px] flex-col bg-background shadow-sm">
        <header className="flex items-center gap-2 border-b border-border/60 bg-background/80 px-5 py-4 backdrop-blur sticky top-0 z-20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage/15 text-sage">
            <Sprout size={18} />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
            Little Leaps
          </span>
        </header>

        <main className="flex-1 pb-24">{children ?? <Outlet />}</main>

        <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 border-t border-border/60 bg-background/95 backdrop-blur">
          <ul className="grid grid-cols-4">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              return (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    className={`flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                      active ? "text-sage" : "text-muted-foreground"
                    }`}
                  >
                    <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
