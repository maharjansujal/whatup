import type { Receipt } from "./receipt";

export type MessageType = "text" | "image" | "file" | "system";

export interface CreateMessageInput {
  conversation_id: string;
  sender_id: string;
  type: MessageType;
  content: string;
  reply_to_message_id: string | null;
  files?: File[];
  updated_at?: string;
  deleted_at?: string;
}

export interface MessageSender {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}
export interface Message extends CreateMessageInput {
  id: string;
  created_at: string;
  sender: MessageSender;
  attachments: Attachment[];
  receipts: Receipt[];
}

export interface AttachmentInput {
  message_id: string;
  file_url: string;
  filename: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail_url?: string;
}

export interface Attachment extends AttachmentInput {
  id: string;
}
