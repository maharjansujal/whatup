export type MessageType = "text" | "image" | "file" | "system";

export interface CreateMessageInput {
  conversation_id: string;
  sender_id: string;
  type: MessageType;
  content: string;
  reply_to_message_id: string;
  updated_at?: string;
  deleted_at?: string;
}
