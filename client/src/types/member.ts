import type { Role } from "./conversation";

export interface Member {
  id: string;
  conversation_id: string;
  user_id: string;
  role: Role;
  joined_at: string;
  last_read_message_id: string;
  last_read_at?: string;
  is_muted: boolean;
  is_archived: boolean;
  nickname?: string;
}
