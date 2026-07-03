import { createAppError } from "../../shared/errors/appError";
import { messagesRepository } from "./repository";
import { Message, Attachment, AttachmentInput } from "./types";

// Create a new message
const createMessage = async (data: {
  conversationId: string;
  senderId: string;
  type: string;
  content: string;
  replyToMessageId?: string;
}): Promise<Message> => {
  if (!data.content && data.type === "text") {
    throw createAppError("Message content cannot be empty", 400);
  }
  return messagesRepository.create(data);
};

// Find a message by ID
const getMessageById = async (messageId: string): Promise<Message> => {
  const message = await messagesRepository.findById(messageId);
  if (!message) {
    throw createAppError("Message not found", 404);
  }
  return message;
};

// Update message content
const updateMessageContent = async ({
  messageId,
  content,
}: {
  messageId: string;
  content: string;
}): Promise<Message> => {
  const updated = await messagesRepository.updateContent(messageId, content);
  if (!updated) {
    throw createAppError("Message not found or deleted", 404);
  }
  return updated;
};

// Soft delete a message
const deleteMessage = async (messageId: string): Promise<Message> => {
  const deleted = await messagesRepository.softDelete(messageId);
  if (!deleted) {
    throw createAppError("Message not found or already deleted", 404);
  }
  return deleted;
};

// Get conversation messages with pagination
const getConversationMessages = async (
  convoId: string,
  cursor: Date | null,
  limit: number,
): Promise<Message[]> => {
  return messagesRepository.getConversationMessages(convoId, cursor, limit);
};

// Get last message in a conversation
const getLastMessage = async (convoId: string): Promise<Message | null> => {
  return messagesRepository.getLastMessage(convoId);
};

// Count messages in a conversation
const countMessages = async (convoId: string): Promise<number> => {
  return messagesRepository.countMessages(convoId);
};

const searchMessages = async (
  convoId: string,
  keyword: string,
): Promise<Message[]> => {
  return messagesRepository.searchMessages(convoId, keyword);
};

const findReplyMessages = async (messageId: string): Promise<Message[]> => {
  return messagesRepository.findReplyMessages(messageId);
};

const addAttachments = async (
  data: {
    messageId: string;
    fileUrl: string;
    filename?: string;
    mimeType?: string;
    size?: number;
    width?: number;
    height?: number;
    duration?: number;
    thumbnailUrl?: string;
  }[],
): Promise<Attachment[]> => {
  return messagesRepository.addAttachments(data);
};

const getAttachments = async (messageId: string): Promise<Attachment[]> => {
  return messagesRepository.getAttachments(messageId);
};

const deleteAttachments = async (messageId: string): Promise<Attachment[]> => {
  return messagesRepository.deleteAttachments(messageId);
};

export const messageService = {
  createMessage,
  getMessageById,
  updateMessageContent,
  deleteMessage,
  getConversationMessages,
  getLastMessage,
  countMessages,
  searchMessages,
  findReplyMessages,
  addAttachments,
  getAttachments,
  deleteAttachments,
};
