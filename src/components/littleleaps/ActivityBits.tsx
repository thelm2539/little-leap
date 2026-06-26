import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Smile, Meh, Frown } from "lucide-react";
import { toast } from "sonner";
import {
  type Activity,
  DOMAIN_BADGE,
  DOMAIN_DOT,
  DOMAIN_LABEL,
} from "@/lib/littleleaps/data";
import { useActivityLog, type Rating, latestRatingFor } from "@/lib/littleleaps/storage";

export function DomainBadge({ domain }: { domain: Activity["domain"] }) {
  return (
    <Badge variant="outline" className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${DOMAIN_BADGE[domain]}`}>
      {DOMAIN_LABEL[domain]}
    </Badge>
  );
}

export function DomainDot({ domain }: { domain: Activity["domain"] }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${DOMAIN_DOT[domain]}`} />;
}

export function DurationPill({ duration }: { duration: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Clock size={12} /> {duration}
    </span>
  );
}

const RATING_LABEL: Record<Rating, string> = {
  engaged: "Engaged",
  neutral: "Neutral",
  fussy: "Fussy",
};

export function RatingButtons({ activityId, compact = false }: { activityId: string; compact?: boolean }) {
  const { logRating } = useActivityLog();
  const [pending, setPending] = useState<Rating | null>(null);

  const handle = async (r: Rating) => {
    setPending(r);
    try {
      await logRating(activityId, r);
      toast.success("Logged!", { description: `Marked as ${RATING_LABEL[r]}.` });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not save. Please try again.";
      toast.error("Couldn't save", { description: msg });
    } finally {
      setPending(null);
    }
  };

  const items: { r: Rating; icon: typeof Smile; label: string }[] = [
    { r: "engaged", icon: Smile, label: "Engaged" },
    { r: "neutral", icon: Meh, label: "Neutral" },
    { r: "fussy", icon: Frown, label: "Fussy" },
  ];

  return (
    <div className={`grid grid-cols-3 gap-2 ${compact ? "" : "mt-2"}`}>
      {items.map(({ r, icon: Icon, label }) => (
        <Button
          key={r}
          variant="outline"
          size="sm"
          disabled={pending !== null}
          onClick={() => handle(r)}
          className="h-auto flex-col gap-1 rounded-2xl border-border/70 bg-cream/40 py-2.5 text-xs font-medium text-foreground hover:bg-sage/10 hover:text-foreground disabled:opacity-60"
        >
          <Icon size={18} className={pending === r ? "animate-pulse text-sage" : "text-sage"} />
          {label}
        </Button>
      ))}
    </div>
  );
}

export function RatingBadge({ activityId }: { activityId: string }) {
  const { log } = useActivityLog();
  const rating = latestRatingFor(log, activityId);
  if (!rating) {
    return <span className="text-[11px] text-muted-foreground">Not yet tried</span>;
  }
  const colour =
    rating === "engaged"
      ? "bg-sage/15 text-sage"
      : rating === "neutral"
        ? "bg-cream-dark text-foreground/70"
        : "bg-destructive/10 text-destructive";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${colour}`}>
      {RATING_LABEL[rating]}
    </span>
  );
}
