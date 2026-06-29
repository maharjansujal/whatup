import { User } from "lucide-react";
import type { Presence, Status } from "../../types/user";

interface AvatarProps {
  image?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  showBorder?: boolean;
  className?: string;
}

const sizes = {
  sm: "w-8 h-8",
  md: "w-11 h-11",
  lg: "w-14 h-14",
};

const presenceStyles: Record<
  Presence,
  { color: string; pulse?: boolean; icon?: string }
> = {
  online: {
    color: "bg-green-500",
    pulse: true,
  },
  idle: {
    color: "bg-yellow-400",
  },
  away: {
    color: "bg-orange-400",
  },
  "do-not-disturb": {
    color: "bg-red-500",
  },
  offline: {
    color: "bg-gray-500",
  },
};

export function getPresence(
  isOnline: boolean,
  customStatus?: Status | null,
): Presence {
  if (customStatus === "do-not-disturb") return "do-not-disturb";
  if (customStatus === "away") return "away";
  if (customStatus === "idle") return "idle";

  return isOnline ? "online" : "offline";
}

export function Avatar({
  image,
  name,
  size = "md",
  showBorder = false,
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full bg-border-dark flex items-center justify-center overflow-hidden ${
        showBorder ? "border border-border-dark" : ""
      } ${className}`}
    >
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        <User size={18} className="text-muted" />
      )}
    </div>
  );
}

export function PresenceDot({ presence }: { presence: Presence }) {
  const style = presenceStyles[presence];

  return (
    <span
      className={`absolute bottom-0 right-1 w-2 h-2 rounded-full ${style.color} ${
        style.pulse ? "animate-pulse" : ""
      }`}
    />
  );
}
