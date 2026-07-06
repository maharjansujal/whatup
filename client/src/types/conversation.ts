export type ConversationType = "direct" | "group";
export type Role = "admin" | "member" | "owner";

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  description: string;
  image_url: string;
  created_by_user_id: string;
  member_ids: string[];
  last_message: LastMessage | null;
  is_archived: boolean;
  muted_until?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface LastMessage {
  id: string;
  sender_id: string;
  content: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface CreateConversationInput {
  type: ConversationType;
  createdByUserId: string;
  name?: string;
}

export interface CreateMemberInput {
  conversationId: string;
  userId: string;
  role?: Role;
}

export interface ConversationUpdateInput {
  name?: string;
  description?: string;
  imageUrl?: string;
}
