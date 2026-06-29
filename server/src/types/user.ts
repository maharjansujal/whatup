export interface User {
  id: number;
  username: string;
  name: string;
  password_hash: string;
  image: string | null;
  created_at: string;
  updated_at: string | null;
  last_seen_at: string | null;
  custom_status: Status | null;
  status_mode: Mode;
}

export type Mode = "manual" | "auto";

export type Status = "idle" | "away" | "do-not-disturb";
