import type { User } from "../types/user";
export type Presence = "dnd" | "away" | "online" | "offline";

export function getPresence({
  user,
  onlineUsers,
}: {
  user: User;
  onlineUsers: Set<string>;
}) {
  const isOnline = onlineUsers.has(user.id);

  if (
    user.custom_status &&
    user.status_till &&
    new Date(user.status_till) > new Date()
  ) {
    return user.custom_status;
  }

  return isOnline ? "online" : "offline";
}
