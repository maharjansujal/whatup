export type MessageType = "text" | "image" | "file" | "system";

export interface CreateMessageInput {
  conversation_id: string;
  sender_id: string;
  type: MessageType;
  content: string;
  reply_to_message_id: string;
  files: Express.Multer.File[];
  updated_at?: Date;
  deleted_at?: Date;
}

export interface Message extends CreateMessageInput {
  id: string;
  created_at: Date;
}

export interface AttachmentInput {
  message_id: string;
  file_url: string;
  cloudinary_public_id: string;
  filename: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail_url?: string | null;
}

export interface Attachment extends AttachmentInput {
  id: string;
}
