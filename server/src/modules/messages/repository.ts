import { db } from "../../shared/db";
import { Attachment, AttachmentInput, type Message } from "./types";

const create = async (data: {
  conversationId: string;
  senderId: string;
  type: string;
  content: string;
  replyToMessageId?: string;
}): Promise<Message> => {
  const result = await db.query(
    `INSERT INTO messages (conversation_id, sender_id, type, content, reply_to_message_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.conversationId,
      data.senderId,
      data.type,
      data.content,
      data.replyToMessageId || null,
    ],
  );
  return result.rows[0];
};

const findById = async (messageId: string): Promise<Message | null> => {
  const result = await db.query(
    `SELECT * FROM messages WHERE id = $1 AND deleted_at IS NULL`,
    [messageId],
  );
  return result.rows[0] || null;
};

const updateContent = async (
  messageId: string,
  content: string,
): Promise<Message | null> => {
  const result = await db.query(
    `UPDATE messages
     SET content = $2, updated_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING *`,
    [messageId, content],
  );
  return result.rows[0] || null;
};

const softDelete = async (messageId: string): Promise<Message | null> => {
  const result = await db.query(
    `UPDATE messages
     SET deleted_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING *`,
    [messageId],
  );
  return result.rows[0] || null;
};

const getConversationMessages = async (
  convoId: string,
  cursor: Date | null,
  limit: number,
): Promise<Message[]> => {
  const result = await db.query(
    `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
      AND deleted_at IS NULL
      ${cursor ? "AND created_at < $2" : ""}
    ORDER BY created_at DESC
    LIMIT $${cursor ? 3 : 2}
    `,
    cursor ? [convoId, cursor, limit] : [convoId, limit],
  );
  return result.rows;
};

const getLastMessage = async (convoId: string): Promise<Message | null> => {
  const result = await db.query(
    `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
      AND deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [convoId],
  );
  return result.rows[0] || null;
};

const countMessages = async (convoId: string): Promise<number> => {
  const result = await db.query(
    `
    SELECT COUNT(*) 
    FROM messages
    WHERE conversation_id = $1
      AND deleted_at IS NULL
    `,
    [convoId],
  );
  return parseInt(result.rows[0].count, 10);
};

const searchMessages = async (
  convoId: string,
  keyword: string,
): Promise<Message[]> => {
  const result = await db.query(
    `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
      AND deleted_at IS NULL
      AND content ILIKE '%' || $2 || '%'
    ORDER BY created_at DESC
    `,
    [convoId, keyword],
  );
  return result.rows;
};

const findReplyMessages = async (messageId: string): Promise<Message[]> => {
  const result = await db.query(
    `
    SELECT *
    FROM messages
    WHERE reply_to_message_id = $1
      AND deleted_at IS NULL
    ORDER BY created_at ASC
    `,
    [messageId],
  );
  return result.rows;
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
): Promise<AttachmentInput[]> => {
  const results: AttachmentInput[] = [];
  for (const attachment of data) {
    const result = await db.query(
      `INSERT INTO message_attachments 
       (message_id, file_url, filename, mime_type, size, width, height, duration, thumbnail_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        attachment.messageId,
        attachment.fileUrl,
        attachment.filename || null,
        attachment.mimeType || null,
        attachment.size || null,
        attachment.width || null,
        attachment.height || null,
        attachment.duration || null,
        attachment.thumbnailUrl || null,
      ],
    );
    results.push(result.rows[0]);
  }
  return results;
};

const getAttachments = async (messageId: string): Promise<Attachment[]> => {
  const result = await db.query(
    `SELECT * FROM message_attachments WHERE message_id = $1`,
    [messageId],
  );
  return result.rows;
};

const deleteAttachments = async (messageId: string): Promise<Attachment[]> => {
  const result = await db.query(
    `DELETE FROM message_attachments WHERE message_id = $1 RETURNING *`,
    [messageId],
  );
  return result.rows;
};

export const messagesRepository = {
  create,
  findById,
  updateContent,
  softDelete,
  getConversationMessages,

  getLastMessage,
  countMessages,
  searchMessages,
  findReplyMessages,
  addAttachments,
  getAttachments,
  deleteAttachments,
};
