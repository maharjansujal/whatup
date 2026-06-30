import type { Presence, Status } from "../types/user";

export const formatStatus = (status: Status | Presence | null | undefined) => {
  if (!status) return;
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
