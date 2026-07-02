export type Role = "admin" | "member" | "owner";

export interface CreateMemberInput {
  conversationId: string;
  userId: string;
  role?: Role;
}

export interface Member {
  id: string;
  conversation_id: string;
  user_id: string;
  role: Role;
  joined_at: string;
  last_read_message_id?: string | null;
  last_read_at?: string | null;
  is_muted: boolean;
  is_archived: boolean;
  nickname?: string;
}

export interface ChatMember {
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  role: Role;
}
