import type { Presence } from "../../lib/getPresence";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xs";
  presence?: Presence;
  ring?: boolean;
}

const sizeMap: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-4 w-4 text-[0.4rem]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

const dotSizeMap: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-1 w-1",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3.5 w-3.5",
};

const presenceMap: Record<Presence, string> = {
  away: "bg-orange-200",
  online: "bg-green-500",
  offline: "bg-gray-500",
  dnd: "bg-red-500",
};

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function Avatar({
  src,
  name,
  size = "md",
  presence,
  ring,
}: AvatarProps) {
  const dims = sizeMap[size];

  return (
    <div className={`relative shrink-0 ${dims}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`h-full w-full rounded-full object-cover ${ring ? "ring-2 ring-[#00C2A8] ring-offset-2 ring-offset-[#12131C]" : ""}`}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center rounded-full bg-[#2A2D3E] font-['Space_Grotesk'] font-medium text-[#DCE0F0] ${ring ? "ring-2 ring-[#00C2A8] ring-offset-2 ring-offset-[#12131C]" : ""}`}
        >
          {initialsFor(name)}
        </div>
      )}
      {presence && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizeMap[size]} rounded-full border-2 border-[#12131C] ${
            presenceMap[presence]
          }`}
        />
      )}
    </div>
  );
}
