/**
 * BirthDateGate.tsx
 *
 * A dialog that appears in two situations:
 *   1. First run — no birth date stored yet. The dialog blocks the app until
 *      the user enters a date (can't be dismissed with Escape or clicking outside).
 *   2. Edit mode — the user clicks the pencil icon in the AppShell header, which
 *      dispatches the "littleleaps:editBirthDate" custom event. The gate opens
 *      in dismissible mode, pre-filled with the current date.
 *
 * This component lives in __root.tsx (outside all page components) so it is
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
  const { birthDate, setBirthDate } = useBirthDate();

  // editMode = true when the AppShell edit button fires the custom event
  const [editMode, setEditMode] = useState(false);

  // Pre-fill with existing date when editing; start blank for first run
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

  // isFirstRun = never had a date stored. The gate is blocking in this case.
  const isFirstRun = !birthDate;

  // Open when: first run (no date stored) OR edit mode was triggered
  const isOpen = isFirstRun || editMode;
  if (!isOpen) return null;

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
        // Only allow closing via the Cancel button in edit mode.
        // First-run gate is blocking — must submit a date.
        if (!open && !isFirstRun) cancel();
      }}
    >
      <DialogContent
        className="max-w-[380px] rounded-3xl border-border/60 p-6 [&>button]:hidden"
        onInteractOutside={(e) => { if (isFirstRun) e.preventDefault(); }}
        onEscapeKeyDown={(e) => { if (isFirstRun) e.preventDefault(); }}
      >
        <DialogHeader className="items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
            <Sprout size={22} />
          </div>
          <DialogTitle className="font-serif text-xl">
            {isFirstRun ? "Welcome to Little Leaps" : "Change birth date"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isFirstRun
              ? "Enter your baby's birth date to personalise the timeline and milestones."
              : "Update the birth date and the app will recalculate everything."}
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
            {isFirstRun ? "Get started" : "Save"}
          </Button>

          {/* Cancel only available in edit mode — first-run gate has no escape */}
          {!isFirstRun && (
            <Button
              variant="ghost"
              onClick={cancel}
              className="h-9 w-full rounded-full text-muted-foreground"
            >
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
