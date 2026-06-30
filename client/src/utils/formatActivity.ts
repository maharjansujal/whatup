export function formatLastSeen(lastSeenAt: string | null): string {
  if (!lastSeenAt) return "Never";

  const diff = Date.now() - new Date(lastSeenAt).getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m`;
  if (diff < day) return `${Math.floor(diff / hour)}h`;

  return `${Math.floor(diff / day)}d`;
}
