/**
 * profile.tsx — the Profile tab.
 *
 * Replaces the Ask tab in the bottom nav (Ask still exists at /ask, just hidden).
 * Lets the parent:
 *   - see and edit the baby's birth date (via the shared BirthDateGate) and name
 *   - see their unique family session and its members
 *   - mint / share an invite link for a caregiver
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/littleleaps/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Pencil,
  Copy,
  Check,
  UserPlus,
  Baby,
  Info,
  Download,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { getAge } from "@/lib/littleleaps/age";
import {
  useBirthDate,
  useBabyName,
  useInviteCode,
  useFamilyMembers,
  createInviteCode,
  inviteUrl,
  exportMyData,
  deleteMyAccount,
} from "@/lib/littleleaps/storage";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Little Leaps" },
      { name: "description", content: "Your baby's profile and family session." },
    ],
  }),
  component: ProfilePage,
});

const fmtBorn = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const fmtJoined = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function ProfilePage() {
  const { birthDate } = useBirthDate();
  const { babyName, setBabyName } = useBabyName();
  const members = useFamilyMembers();
  const inviteCode = useInviteCode();

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(babyName ?? "");
  const [savingName, setSavingName] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  // OnboardingGate covers first run; nothing to show until it's done.
  if (!birthDate) return null;

  const weeks = getAge(birthDate).weeks;
  const others = members.filter((m) => !m.isSelf);

  const saveName = async () => {
    setSavingName(true);
    try {
      await setBabyName(nameDraft);
      setEditingName(false);
    } catch (e) {
      toast.error("Couldn't save the name", {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setSavingName(false);
    }
  };

  const editBirthDate = () => window.dispatchEvent(new CustomEvent("littleleaps:editBirthDate"));

  const copyInviteLinkDirect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inviteCode) {
      setInviteOpen(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(inviteUrl(inviteCode));
      toast.success("Invite link copied");
    } catch {
      toast.error("Couldn't copy — tap the row to see the full link");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 px-5 pt-6">
        {/* ── Baby profile header ── */}
        <section className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-sage/12">
            <span className="h-4 w-4 rounded-full bg-sage" />
          </div>

          {editingName ? (
            <div className="flex w-full max-w-[260px] items-center gap-2">
              <Input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveName();
                  if (e.key === "Escape") setEditingName(false);
                }}
                placeholder="Baby's name"
                className="h-9 rounded-xl text-center"
              />
              <Button
                size="sm"
                onClick={saveName}
                disabled={savingName}
                className="h-9 rounded-xl bg-sage hover:bg-sage/90"
              >
                {savingName ? "Saving…" : "Save"}
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNameDraft(babyName ?? "");
                setEditingName(true);
              }}
              className="group inline-flex items-center gap-1.5"
            >
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                {babyName ?? "Baby's profile"}
              </h1>
              <Pencil
                size={14}
                className="text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </button>
          )}

          <p className="mt-1 text-sm text-muted-foreground">
            Born {fmtBorn(birthDate)} · {weeks} weeks ·{" "}
            <button
              type="button"
              onClick={editBirthDate}
              className="inline-flex items-center gap-0.5 text-sage hover:underline"
            >
              edit <Pencil size={11} />
            </button>
          </p>
        </section>

        {/* ── Family ── */}
        <section className="space-y-2">
          <SectionLabel>Family</SectionLabel>
          <Card className="rounded-3xl border-border/60 shadow-none divide-y divide-border/60">
            {/* Not a plain Row: needs a separate copy button alongside the
                tap-to-open-dialog area, and a <button> can't nest a <button>. */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <button
                type="button"
                onClick={() => setInviteOpen(true)}
                className="flex flex-1 items-center justify-between gap-2 text-left"
              >
                <span className="text-sm text-foreground">Invite code</span>
                <span className="font-mono text-sm font-semibold tracking-wide text-foreground">
                  {inviteCode ? truncateCode(inviteCode) : "Set up"}
                </span>
              </button>
              {inviteCode && (
                <button
                  type="button"
                  onClick={copyInviteLinkDirect}
                  aria-label="Copy invite link"
                  className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                >
                  <Copy size={14} />
                </button>
              )}
            </div>
            <Row label="You" value={<Muted>This device</Muted>} />
            {others.map((m) => (
              <Row
                key={m.userId}
                label="Partner"
                value={<Muted>Joined {fmtJoined(m.joinedAt)}</Muted>}
              />
            ))}
            <div className="p-2">
              <Button
                variant="outline"
                onClick={() => setInviteOpen(true)}
                className="h-11 w-full rounded-2xl border-border/60 text-sage hover:bg-sage/8 hover:text-sage"
              >
                <UserPlus size={16} className="mr-1.5" />
                Invite a caregiver
              </Button>
            </div>
          </Card>
        </section>

        {/* ── About ── */}
        <section className="space-y-2">
          <SectionLabel>About</SectionLabel>
          <Card className="rounded-3xl border-border/60 shadow-none">
            <Link
              to="/about"
              className="flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-secondary/40"
            >
              <span className="flex items-center gap-2.5 text-sm text-foreground">
                <Info size={16} className="text-muted-foreground" />
                About & Sources
              </span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </Card>
        </section>

        {/* ── Account ── */}
        <AccountSection />

        <div className="h-4" />
      </div>

      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        code={inviteCode}
        babyName={babyName}
      />
    </AppShell>
  );
}

// ─── Invite dialog ──────────────────────────────────────────────────────────
function InviteDialog({
  open,
  onOpenChange,
  code,
  babyName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  code: string | null;
  babyName: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mint a code the first time the dialog is opened without one.
  useEffect(() => {
    if (open && !code && !busy) {
      setBusy(true);
      createInviteCode()
        .catch((e) =>
          toast.error("Couldn't create an invite", {
            description: e instanceof Error ? e.message : undefined,
          }),
        )
        .finally(() => setBusy(false));
    }
  }, [open, code, busy]);

  const url = code ? inviteUrl(code) : "";

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Invite link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select and copy the link manually");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] rounded-3xl border-border/60 p-6">
        <DialogHeader className="items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
            <Baby size={22} />
          </div>
          <DialogTitle className="font-serif text-xl">Invite a caregiver</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Share this link so a partner can join {babyName ? `${babyName}'s` : "your baby's"}{" "}
            family on their own device.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-border/60 bg-cream/40 px-4 py-3">
            {busy && !code ? (
              <p className="text-sm text-muted-foreground">Creating your invite link…</p>
            ) : (
              <p className="break-all font-mono text-xs text-foreground">{url}</p>
            )}
          </div>

          <Button
            onClick={copy}
            disabled={!code}
            className="h-11 w-full rounded-full bg-sage text-sage-foreground hover:bg-sage/90"
          >
            {copied ? (
              <Check size={16} className="mr-1.5" />
            ) : (
              <Copy size={16} className="mr-1.5" />
            )}
            {copied ? "Copied" : "Copy invite link"}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Anyone with this link can join your family and see your baby's records. It expires after
            90 days.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Account section ────────────────────────────────────────────────────────
// Export (GDPR portability) and delete (GDPR erasure) both already existed
// server-side — exportMyData() and the delete_my_account RPC — with no UI
// trigger until now. See BACKLOG item 5.
function AccountSection() {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `little-leaps-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    } catch (e) {
      toast.error("Couldn't export your data", {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMyAccount();
      // Auth/session state changed underneath the app (signed out, family
      // gone) — a full reload is the safest way back to onboarding rather
      // than relying on every hook to reconcile in place.
      window.location.href = "/";
    } catch (e) {
      toast.error("Couldn't delete your account", {
        description: e instanceof Error ? e.message : undefined,
      });
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-2">
      <SectionLabel>Account</SectionLabel>
      <Card className="rounded-3xl border-border/60 shadow-none divide-y divide-border/60">
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-secondary/40 disabled:opacity-60"
        >
          <span className="flex items-center gap-2.5 text-sm text-foreground">
            <Download size={16} className="text-muted-foreground" />
            {exporting ? "Preparing export…" : "Export my data"}
          </span>
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-destructive/8"
            >
              <span className="flex items-center gap-2.5 text-sm text-destructive">
                <Trash2 size={16} />
                Delete account
              </span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[380px] rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes your baby's birth date, name, and every logged activity. If
                a partner shares this family and no one else is left in it, their access is removed
                too. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Deleting…" : "Delete account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </section>
  );
}

// ─── Small building blocks ──────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-muted-foreground">{children}</span>;
}

function Row({
  label,
  value,
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="text-sm text-foreground">{label}</span>
      {value}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-secondary/40"
      >
        {content}
      </button>
    );
  }
  return <div className="flex items-center justify-between px-4 py-3.5">{content}</div>;
}

function truncateCode(code: string): string {
  return code.length > 9 ? `${code.slice(0, 9)}…` : code;
}
