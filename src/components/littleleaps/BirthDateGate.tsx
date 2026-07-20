/**
 * BirthDateGate.tsx
 *
 * A dialog that appears in two situations:
 *   1. First run — no birth date has ever been stored. The dialog is blocking:
 *      the user can't dismiss it without entering a date.
 *   2. Editing — the user clicks the edit icon in the header. The dialog is
 *      dismissible because we already have a valid date stored.
 *
 * Pattern mirrors FamilyKeyGate.tsx — a modal gate that lives in AppShell and
 * is invisible once the required value is stored.
 *
 * Props:
 *   forceOpen — set to true to open in edit mode even if a date exists
 *   onClose   — called when the dialog should close (edit mode only)
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { useBirthDate } from "@/lib/littleleaps/storage";

interface BirthDateGateProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function BirthDateGate({ forceOpen = false, onClose }: BirthDateGateProps) {
  const { birthDate, setBirthDate } = useBirthDate();

  // Pre-fill with the stored date if editing; blank for first run
  const [value, setValue] = useState(birthDate ?? "");

  // Show if: no date stored yet (first run) OR edit button was clicked
  const isOpen = forceOpen || !birthDate;
  if (!isOpen) return null;

  // First-run gate is blocking — we need a date before the app can work
  const isFirstRun = !birthDate;

  const submit = () => {
    if (!value) return;
    setBirthDate(value); // Persists to localStorage + triggers all useBirthDate() hooks
    onClose?.();         // Close the dialog if we're in edit mode
  };

  // Today's date in YYYY-MM-DD — used as the max for the date input
  // so the user can't pick a future birth date
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        // Allow closing only in edit mode (when a date is already stored)
        if (!open && !isFirstRun) onClose?.();
      }}
    >
      <DialogContent
        className="max-w-[380px] rounded-3xl border-border/60 p-6 [&>button]:hidden"
        // Prevent dismissing the first-run gate by clicking outside or pressing Escape
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
              : "Update your baby's birth date and the app will recalculate everything."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          {/*
            type="date" gives a native date picker — the browser handles the UI.
            Its value is always "YYYY-MM-DD", which is exactly what we store.
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

          {/* Cancel only available in edit mode */}
          {!isFirstRun && (
            <Button
              variant="ghost"
              onClick={onClose}
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
