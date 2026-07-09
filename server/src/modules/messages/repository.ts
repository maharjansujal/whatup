import { Pool, PoolClient } from "pg";
import { db } from "../../shared/db";
import {
  Attachment,
  AttachmentInput,
  CreateMessageInput,
  type Message,
} from "./types";

type DbExecutor = Pool | PoolClient;
const MESSAGE_WITH_ATTACHMENTS_SELECT = `
SELECT
  m.*,
  COALESCE(
    json_agg(ma.* ORDER BY ma.created_at)
      FILTER (WHERE ma.id IS NOT NULL),
    '[]'
  ) AS attachments
FROM messages m
LEFT JOIN message_attachments ma
  ON ma.message_id = m.id
`;

const create = async ({
  executor = db,
  data,
}: {
  executor?: DbExecutor;
  data: CreateMessageInput;
}): Promise<Message> => {
  const result = await executor.query(
    `INSERT INTO messages (
      conversation_id,
      sender_id,
      type,
      content,
      reply_to_message_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      data.conversation_id,
      data.sender_id,
      data.type,
      data.content,
      data.reply_to_message_id ?? null,
    ],
  );

  return result.rows[0];
};

const createAttachments = async ({
  executor = db,
  attachments,
}: {
  executor?: DbExecutor;
  attachments: AttachmentInput[];
}) => {
  if (!attachments.length) return;

  const values: unknown[] = [];

  const placeholders = attachments.map((attachment, index) => {
    values.push(
      attachment.message_id,
      attachment.file_url,
      attachment.cloudinary_public_id,
      attachment.filename,
      attachment.mime_type,
      attachment.size,
      attachment.width ?? null,
      attachment.height ?? null,
      attachment.duration ?? null,
      attachment.thumbnail_url ?? null,
    );

    const offset = index * 10;

    return `(
  ${Array.from({ length: 10 }, (_, i) => `$${offset + i + 1}`).join(", ")}
    )`;
  });

  await executor.query(
    `INSERT INTO message_attachments (
      message_id,
      file_url,
      cloudinary_public_id,
      filename,
      mime_type,
      size,
      width,
      height,
      duration,
      thumbnail_url
    )
    VALUES ${placeholders.join(", ")}`,
    values,
  );
};

const updateConversationLastMessage = async ({
  executor = db,
  conversationId,
  messageId,
  createdAt,
}: {
  executor?: DbExecutor;
  conversationId: string;
  messageId: string;
  createdAt: Date;
}) => {
  await executor.query(
    `UPDATE conversations
     SET last_message_id = $1,
         last_message_at = $2,
         updated_at = NOW()
     WHERE id = $3`,
    [messageId, createdAt, conversationId],
  );
};

const findById = async (messageId: string): Promise<Message | null> => {
  const result = await db.query(
    `
    ${MESSAGE_WITH_ATTACHMENTS_SELECT}
    WHERE m.id = $1
    GROUP BY m.id
    `,
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
    ${MESSAGE_WITH_ATTACHMENTS_SELECT}
    WHERE m.conversation_id = $1
      ${cursor ? "AND m.created_at < $2" : ""}
    GROUP BY m.id
    ORDER BY m.created_at ASC
    LIMIT $${cursor ? 3 : 2}
    `,
    cursor ? [convoId, cursor, limit] : [convoId, limit],
  );
  console.log("Result.rows", result.rows);
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
  createAttachments,
  updateConversationLastMessage,
  findById,
  updateContent,
  softDelete,
  getConversationMessages,

  getLastMessage,
  countMessages,
  searchMessages,
  findReplyMessages,
  getAttachments,
  deleteAttachments,
};
