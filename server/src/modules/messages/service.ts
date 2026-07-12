import { deleteAsset, uploadStream } from "../../shared/cloudinary/upload";
import { createAppError } from "../../shared/errors/appError";
import { messagesRepository } from "./repository";
import { Message, Attachment, CreateMessageInput } from "./types";
import { db } from "../../shared/db";
import { memberRepository } from "../members/repository";
import { receiptsRepository } from "../receipts/repository";

const createMessage = async (data: CreateMessageInput): Promise<Message> => {
  const hasText = data.content.trim().length > 0;
  const files = data.files ?? [];

  const hasFiles = files.length > 0;

  if (!hasText && !hasFiles) {
    throw createAppError(
      "Message must contain text or at least one attachment",
      400,
    );
  }

  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const result = await uploadStream({
        fileBuffer: file.buffer,
        folder: "whatup/messages",
      });

      return {
        file_url: result.secure_url,
        cloudinary_public_id: result.public_id,
        cloudinary_resource_type: result.resource_type,
        filename: file.originalname,
        mime_type: file.mimetype,
        size: file.size,
        width: result.width,
        height: result.height,
        duration: result.duration,
        thumbnail_url: null,
      };
    }),
  );

  console.log("UPLOADED FILES", uploadedFiles);

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const message = await messagesRepository.create({
      executor: client,
      data,
    });

    await messagesRepository.createAttachments({
      executor: client,
      attachments: uploadedFiles.map((file) => ({
        message_id: message.id,
        ...file,
      })),
    });

    await messagesRepository.updateConversationLastMessage({
      executor: client,
      conversationId: data.conversation_id,
      messageId: message.id,
      createdAt: message.created_at,
    });

    const memberIds = await memberRepository.getMemberIds(data.conversation_id);

    const recipientIds = memberIds.filter((id) => id !== data.sender_id);

    await Promise.all(
      recipientIds.map((userId) =>
        receiptsRepository.createReceipt({
          messageId: message.id,
          userId,
          executor: client,
        }),
      ),
    );

    await client.query("COMMIT");

    const createdMessage = await messagesRepository.findById(message.id);

    if (!createdMessage) {
      throw createAppError("Failed to retrieve created message", 500);
    }

    return createdMessage;
  } catch (error) {
    await client.query("ROLLBACK");

    await Promise.allSettled(
      uploadedFiles.map((file) => deleteAsset(file.cloudinary_public_id)),
    );

    throw error;
  } finally {
    client.release();
  }
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
  await deleteAttachments(messageId);
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

const getAttachments = async (messageId: string): Promise<Attachment[]> => {
  return messagesRepository.getAttachments(messageId);
};

const deleteAttachments = async (messageId: string): Promise<Attachment[]> => {
  const client = await db.connect();

  try {
    const attachments = await messagesRepository.getAttachments(messageId);

    if (!attachments.length) {
      return [];
    }

    await Promise.all(
      attachments.map((attachment) =>
        deleteAsset(
          attachment.cloudinary_public_id,
          attachment.cloudinary_resource_type,
        ),
      ),
    );

    await client.query("BEGIN");

    const deleted = await messagesRepository.deleteAttachments({
      executor: client,
      messageId,
    });

    await client.query("COMMIT");

    return deleted;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
  getAttachments,
  deleteAttachments,
};
