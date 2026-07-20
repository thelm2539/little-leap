/**
 * OnboardingGate.tsx
 *
 * A blocking multi-step dialog that runs once on first use.
 * Replaces the old FamilyKeyGate + BirthDateGate first-run behaviour.
 *
 * Flow:
 *   (a) Check for existing session → if familyKey + birthDate already in localStorage, skip entirely
 *   (b) Show "New family" vs "Restore with code" choice
 *       New    → enter birth date → auto-generate family code → save to Supabase + localStorage
 *       Restore → enter family code → fetch birth date from Supabase → if not found, ask for it
 *   (c) Gate closes → app renders normally
 *
 * Also handles the loading state while Supabase anon-auth initialises — on a
 * returning device, localStorage may have been cleared but Supabase remembers
 * the session, so useFamilyKey recovers both family_key AND birth_date automatically.
 *
 * Lives in __root.tsx (outside all page routes) so it is always mounted.
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
import { Input } from "@/components/ui/input";
import { Sprout, Baby, RotateCcw, Copy, Check } from "lucide-react";
import {
  useFamilyKey,
  useBirthDate,
  createFamilyProfile,
  joinFamilyProfile,
  saveBirthDateToProfile,
} from "@/lib/littleleaps/storage";

// ─── Step types ───────────────────────────────────────────────────────────────
// The gate moves through these steps in sequence depending on user choices.
type Step =
  | "choice"          // Welcome: "New family" vs "Restore with code"
  | "new-birth"       // Enter birth date for a new family
  | "new-success"     // Show the generated family code (share with partner)
  | "restore-code"    // Enter family code to restore
  | "restore-birth";  // Birth date not found for that code — enter manually

// ─── Component ────────────────────────────────────────────────────────────────
export function OnboardingGate() {
  const { familyKey, ready } = useFamilyKey();
  const { birthDate } = useBirthDate();

  const [step, setStep]             = useState<Step>("choice");
  const [birthValue, setBirthValue] = useState("");
  const [codeValue, setCodeValue]   = useState("");
  const [busy, setBusy]             = useState(false);
  const [error, setError]           = useState<string | null>(null);
  // generatedCode is set after createFamilyProfile so we can show it to the user.
  // Keeping it in state (not just returning from handler) means the success screen
  // stays visible even if the gate's auto-close condition becomes true.
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeCopied, setCodeCopied]       = useState(false);

  // ── Gate is invisible when the user is fully set up ──
  // Both values are needed: familyKey identifies the session, birthDate drives the UI.
  // Exception: keep showing the gate if we're on "new-success" (showing the code).
  if (ready && familyKey && birthDate && !generatedCode) return null;

  // ── Loading state ──
  // useFamilyKey runs async Supabase auth + recovery on mount.
  // Show a spinner until it's done — this avoids flashing the onboarding
  // form to a returning user whose data is about to auto-restore.
  if (!ready) {
    return (
      <Dialog open>
        <DialogContent
          className="max-w-[380px] rounded-3xl border-border/60 p-6 [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-sage border-t-transparent" />
            <p className="text-sm text-muted-foreground">Setting up…</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Edge case: familyKey exists but birth date is missing ──
  // Skip the choice step — just ask for the birth date.
  const activeStep: Step = (familyKey && !birthDate && step === "choice")
    ? "new-birth"
    : step;

  // Today's date in YYYY-MM-DD — used as the max for the date input
  const todayIso = new Date().toISOString().slice(0, 10);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Create a new family profile with the entered birth date */
  const handleCreate = async () => {
    if (!birthValue) return;
    setBusy(true);
    setError(null);
    try {
      const key = await createFamilyProfile(birthValue);
      // Show the success step so the user can copy/share their family code
      setGeneratedCode(key);
      setStep("new-success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create profile. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  /** Join an existing family by code, fetching birth date from Supabase */
  const handleRestore = async () => {
    if (!codeValue.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { birthDate: found } = await joinFamilyProfile(codeValue);
      if (found) {
        // Gate auto-closes because hooks update
      } else {
        // Code was valid but no birth date stored — ask for it
        setStep("restore-birth");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not restore. Check the code and try again.");
    } finally {
      setBusy(false);
    }
  };

  /** Save the manually-entered birth date after a restore where none was found */
  const handleRestoreBirth = async () => {
    if (!birthValue) return;
    setBusy(true);
    setError(null);
    try {
      await saveBirthDateToProfile(birthValue);
      // Gate auto-closes because useBirthDate hook updates
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  /** Copy the family code to clipboard */
  const handleCopyCode = async () => {
    if (!generatedCode) return;
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // clipboard API unavailable — the code is visible on screen
    }
  };


  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog open>
      <DialogContent
        className="max-w-[380px] rounded-3xl border-border/60 p-6 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >

        {/* ── Step: choice ── */}
        {activeStep === "choice" && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
                <Sprout size={22} />
              </div>
              <DialogTitle className="font-serif text-xl">Welcome to Little Leaps</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Track your baby's development week by week, grounded in science.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-2">
              <Button
                onClick={() => { setStep("new-birth"); setError(null); }}
                className="h-12 w-full rounded-2xl bg-sage text-sage-foreground hover:bg-sage/90 flex items-center gap-2"
              >
                <Baby size={16} />
                New family profile
              </Button>
              <Button
                variant="outline"
                onClick={() => { setStep("restore-code"); setError(null); }}
                className="h-12 w-full rounded-2xl border-border/60 flex items-center gap-2"
              >
                <RotateCcw size={15} />
                Restore with code
              </Button>
            </div>
          </>
        )}

        {/* ── Step: new-birth ── */}
        {activeStep === "new-birth" && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
                <Baby size={22} />
              </div>
              <DialogTitle className="font-serif text-xl">When was your baby born?</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Everything in the app is personalised to your baby's age from this date.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              <input
                type="date"
                value={birthValue}
                onChange={(e) => setBirthValue(e.target.value)}
                max={todayIso}
                autoFocus
                className="h-11 w-full rounded-2xl border border-border/60 bg-cream/40 px-4
                           text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
              <Button
                onClick={handleCreate}
                disabled={!birthValue || busy}
                className="h-11 w-full rounded-full bg-sage text-sage-foreground hover:bg-sage/90"
              >
                {busy ? "Creating…" : "Get started"}
              </Button>
              {!familyKey && (
                <Button variant="ghost" onClick={() => { setStep("choice"); setError(null); }}
                  className="h-9 w-full rounded-full text-muted-foreground text-xs"
                >
                  ← Back
                </Button>
              )}
            </div>
          </>
        )}

        {/* ── Step: new-success ── */}
        {activeStep === "new-success" && generatedCode && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
                <Sprout size={22} />
              </div>
              <DialogTitle className="font-serif text-xl">You're all set!</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                This is your family code. Save it somewhere — you'll need it to access
                Little Leaps on another device or share it with your partner.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              {/* Code display + copy button */}
              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-cream/40 px-4 py-3">
                <span className="flex-1 font-mono text-sm font-semibold tracking-wide text-foreground">
                  {generatedCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  aria-label="Copy family code"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground
                             hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {codeCopied ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
                </button>
              </div>

              <Button
                onClick={() => setGeneratedCode(null)}
                className="h-11 w-full rounded-full bg-sage text-sage-foreground hover:bg-sage/90"
              >
                Got it, let's go
              </Button>
            </div>
          </>
        )}

        {/* ── Step: restore-code ── */}
        {activeStep === "restore-code" && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
                <RotateCcw size={22} />
              </div>
              <DialogTitle className="font-serif text-xl">Enter your family code</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                The code was shown when you first set up Little Leaps on another device.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              <Input
                autoFocus
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleRestore(); }}
                placeholder="e.g. bloom-haven-4729"
                className="h-11 rounded-2xl border-border/60 bg-cream/40"
              />
              <Button
                onClick={handleRestore}
                disabled={!codeValue.trim() || busy}
                className="h-11 w-full rounded-full bg-sage text-sage-foreground hover:bg-sage/90"
              >
                {busy ? "Restoring…" : "Restore"}
              </Button>
              <Button variant="ghost" onClick={() => { setStep("choice"); setError(null); }}
                className="h-9 w-full rounded-full text-muted-foreground text-xs"
              >
                ← Back
              </Button>
            </div>
          </>
        )}

        {/* ── Step: restore-birth ── */}
        {activeStep === "restore-birth" && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
                <Baby size={22} />
              </div>
              <DialogTitle className="font-serif text-xl">One more thing</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                We found your family profile but the birth date wasn't stored.
                Enter it once to complete setup.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              <input
                type="date"
                value={birthValue}
                onChange={(e) => setBirthValue(e.target.value)}
                max={todayIso}
                autoFocus
                className="h-11 w-full rounded-2xl border border-border/60 bg-cream/40 px-4
                           text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
              <Button
                onClick={handleRestoreBirth}
                disabled={!birthValue || busy}
                className="h-11 w-full rounded-full bg-sage text-sage-foreground hover:bg-sage/90"
              >
                {busy ? "Saving…" : "Save"}
              </Button>
            </div>
          </>
        )}

        {/* Error message — shown across all steps */}
        {error && (
          <p className="mt-2 text-center text-xs text-destructive">{error}</p>
        )}

      </DialogContent>
    </Dialog>
  );
}
