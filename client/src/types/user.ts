import type { Status as MessageStatus } from "./message";

export type Mode = "manual" | "auto";
export type Status = "idle" | "away" | "do-not-disturb";

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

export interface UserMessage {
  id: number;
  name: string;
  username: string;
  image: string | null;
  created_at: string;
  last_message: string | null;
  last_message_sender_id: number | null;
  last_message_status: MessageStatus | null;
  last_message_time: string | null;
  last_seen_at: string | null;
  custom_status: Status | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface UpdateUserPayload {
  username?: string;
  name?: string;
  password_hash?: string;
  image?: string | null;
}

export type Presence =
  | "online"
  | "idle"
  | "away"
  | "do-not-disturb"
  | "offline";
