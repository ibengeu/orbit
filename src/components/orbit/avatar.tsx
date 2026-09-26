import { AVATAR_CLASS } from "@/lib/orbit/seed";
import { presenceLabel, presenceOf, userById } from "@/lib/orbit/derive";
import type { Presence } from "@/lib/orbit/types";
import { cn } from "@/lib/utils";

const FALLBACK_TONES = ["bg-avatar-priya", "bg-avatar-noah", "bg-avatar-jules", "bg-avatar-lena", "bg-avatar-avery"];

export function avatarClass(id: string) {
  if (AVATAR_CLASS[id]) return AVATAR_CLASS[id];
  const index = Math.abs(id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % FALLBACK_TONES.length;
  return FALLBACK_TONES[index] ?? "bg-avatar-samir";
}

export function PresenceMark({ presence, className }: { presence: Presence; className?: string }) {
  const label = presenceLabel(presence);
  return (
    <span
      className={cn("absolute -right-0.5 -bottom-0.5 size-2.5 border border-paper", className, {
        "rounded-full bg-online": presence === "online",
        "rounded-full border-2 border-away bg-paper": presence === "away",
        "rounded-sm border-ink-faint bg-paper": presence === "offline",
      })}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function Avatar({
  userId,
  selfPresence,
  size = "md",
  showPresence = false,
}: {
  userId: string;
  selfPresence?: Presence;
  size?: "sm" | "md";
  showPresence?: boolean;
}) {
  const user = userById(userId);
  const presence = presenceOf(userId, selfPresence ?? user.presence);
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md font-semibold text-paper",
          avatarClass(userId),
          size === "sm" ? "size-6 text-xs" : "size-9 text-sm",
        )}
        aria-hidden="true"
      >
        {user.initials}
      </span>
      {showPresence ? <PresenceMark presence={presence} /> : null}
    </span>
  );
}
