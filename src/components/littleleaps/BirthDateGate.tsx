/**
 * BirthDateGate.tsx
 *
 * Edit-only dialog for updating the baby's birth date.
 * Opened by the pencil button in AppShell which dispatches the
 * "littleleaps:editBirthDate" custom event.
 *
 * First-run setup is handled entirely by OnboardingGate (in __root.tsx).
 * This component only ever shows in response to the edit event.
 *
 * This component lives in __root.tsx (outside all page routes) so it is
 * always mounted — even when pages return null early because no birth date is set.
 *
 * Communication with AppShell uses a custom event (same pattern as familyKey
 * and activity log events in storage.ts) — no React context or prop drilling needed.
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { useBirthDate, saveBirthDateToProfile } from "@/lib/littleleaps/storage";

export function BirthDateGate() {
  const { birthDate } = useBirthDate();

  // editMode = true when the AppShell edit button fires the custom event
  const [editMode, setEditMode] = useState(false);

  // Pre-fill with the currently stored date
  const [value, setValue] = useState(birthDate ?? "");

  // Listen for the edit button event dispatched by AppShell.
  // Using a window event keeps BirthDateGate and AppShell decoupled —
  // they don't need to share state or be in a parent/child relationship.
  useEffect(() => {
    const handler = () => {
      setValue(birthDate ?? ""); // Pre-fill with current stored date
      setEditMode(true);
    };
    window.addEventListener("littleleaps:editBirthDate", handler);
    return () => window.removeEventListener("littleleaps:editBirthDate", handler);
  }, [birthDate]); // Re-register when birthDate changes so we always pre-fill the latest

  // Edit-only: only open when the user explicitly triggers an edit.
  // OnboardingGate handles first-run — this gate must never compete with it.
  if (!editMode) return null;

  const submit = () => {
    if (!value) return;
    // saveBirthDateToProfile saves to localStorage + syncs to Supabase
    // so the new date is available on other devices via the restore flow.
    void saveBirthDateToProfile(value);
    setEditMode(false);
  };

  const cancel = () => setEditMode(false);

  // Today in YYYY-MM-DD — prevents picking a future birth date
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        // Dismiss on outside click or Escape (edit mode is always dismissible)
        if (!open) cancel();
      }}
    >
      <DialogContent
        className="max-w-[380px] rounded-3xl border-border/60 p-6 [&>button]:hidden"
      >
        <DialogHeader className="items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
            <Sprout size={22} />
          </div>
          <DialogTitle className="font-serif text-xl">Change birth date</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the birth date and the app will recalculate everything.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          {/*
            type="date" gives a native browser date picker.
            Its value is always "YYYY-MM-DD" — exactly what we store in localStorage.
            max= prevents picking a future date.
          */}
          <input
            type="date"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            max={todayIso}
            className="h-11 w-full rounded-2xl border border-border/60 bg-cream/40 px-4
                       text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage/40"
          />

          <Button
            onClick={submit}
            disabled={!value}
            className="h-11 w-full rounded-full bg-sage text-sage-foreground hover:bg-sage/90"
          >
            Save
          </Button>

          <Button
            variant="ghost"
            onClick={cancel}
            className="h-9 w-full rounded-full text-muted-foreground"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
