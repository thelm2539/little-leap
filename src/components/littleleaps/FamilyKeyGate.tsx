import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { useFamilyKey } from "@/lib/littleleaps/storage";

export function FamilyKeyGate() {
  const { familyKey, setFamilyKey, ready } = useFamilyKey();
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return null;
  if (familyKey) return null;

  const submit = async () => {
    const trimmed = value.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    try {
      await setFamilyKey(trimmed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent
        className="max-w-[380px] rounded-3xl border-border/60 p-6 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
            <Sprout size={22} />
          </div>
          <DialogTitle className="font-serif text-xl">Set up your family</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Pick a short code (e.g. "smith-family" or "baby-june9").
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a family code"
            className="h-11 rounded-2xl border-border/60 bg-cream/40"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
          <Button
            onClick={submit}
            disabled={!value.trim()}
            className="h-11 w-full rounded-full bg-sage text-sage-foreground hover:bg-sage/90"
          >
            Create / Join
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Share this code with your partner so you both see the same data.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
