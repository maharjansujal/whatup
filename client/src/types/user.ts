import type { Status } from "./message";

export interface User {
  id: number;
  username: string;
  name: string;
  password_hash: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserMessage {
  id: number;
  name: string;
  username: string;
  image?: string;
  created_at: string;
  last_message?: string | null;
  last_message_sender_id?: number | null;
  last_message_status?: Status;
  last_message_time?: string | null;
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
