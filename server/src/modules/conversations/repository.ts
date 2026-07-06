import { Pool, PoolClient } from "pg";
import {
  Conversation,
  ConversationUpdateInput,
  CreateConversationInput,
  CreateMemberInput,
} from "./types";
import { db } from "../../shared/db";
import { Member } from "../members/types";
import { updateTable } from "../../shared/utils/updateTable";

type DBExecutor = Pool | PoolClient;

const create = async (
  { type, createdByUserId, name }: CreateConversationInput,
  executor: DBExecutor = db,
): Promise<Conversation> => {
  const result = await executor.query(
    `INSERT INTO conversations (type, created_by_user_id, name)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [type, createdByUserId, name ?? null],
  );

  return result.rows[0];
};

const findById = async (
  id: string,
  executor: DBExecutor = db,
): Promise<Conversation> => {
  const result = await executor.query(
    `SELECT *
     FROM conversations
     WHERE id = $1
       AND deleted_at IS NULL`,
    [id],
  );

  return result.rows[0];
};

const createMember = async (
  { conversationId, userId, role = "member" }: CreateMemberInput,
  executor: DBExecutor = db,
): Promise<Member> => {
  const result = await executor.query(
    `INSERT INTO conversation_members (conversation_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [conversationId, userId, role],
  );

  return result.rows[0];
};

const findDirectConversation = async ({
  userId1,
  userId2,
  executor = db,
}: {
  userId1: string;
  userId2: string;
  executor?: DBExecutor;
}): Promise<Conversation | null> => {
  const result = await executor.query(
    `
    SELECT
    c.*,
    ARRAY_AGG(cm.user_id ORDER BY cm.user_id) AS member_ids
    FROM conversations c
    JOIN conversation_members cm1
        ON cm1.conversation_id = c.id
    JOIN conversation_members cm2
        ON cm2.conversation_id = c.id
    JOIN conversation_members cm
        ON cm.conversation_id = c.id
    WHERE c.type = 'direct'
      AND cm1.user_id = $1
      AND cm2.user_id = $2
      AND cm1.is_archived = FALSE
    GROUP BY c.id
    HAVING COUNT(cm.user_id) = 2;
    `,
    [userId1, userId2],
  );

  return result.rows[0] ?? null;
};

const findUserConversations = async ({
  userId,
  executor = db,
}: {
  userId: string;
  executor?: DBExecutor;
}) => {
  const result = await executor.query(
    `
    SELECT
    c.id,
    c.type,
    c.name,
    m.id AS last_message_id,
    m.sender_id AS last_message_sender_id,
    m.created_at AS last_message_at,
    m.content AS last_message_content,
    m.deleted_at AS last_message_deleted_at,
    ARRAY_AGG(cm.user_id) AS member_ids,
    cm_self.is_archived,
    cm_self.muted_until
    FROM conversations c
    JOIN conversation_members cm
        ON cm.conversation_id = c.id
    JOIN conversation_members cm_self
        ON cm_self.conversation_id = c.id
      AND cm_self.user_id = $1
    LEFT JOIN LATERAL (
        SELECT
            id,
            sender_id,
            created_at,
            content,
            deleted_at
        FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
    ) m ON TRUE
    WHERE c.deleted_at IS NULL
      AND cm_self.is_archived = FALSE
    GROUP BY
        c.id,
        c.type,
        c.name,
        m.id,
        m.sender_id,
        m.created_at,
        m.content,
        m.deleted_at,
        cm_self.is_archived,
        cm_self.muted_until
    ORDER BY m.created_at DESC NULLS LAST;
    `,
    [userId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    member_ids: row.member_ids,
    is_archived: row.is_archived,
    muted_until: row.muted_until,
    last_message: row.last_message_id
      ? {
          id: row.last_message_id,
          sender_id: row.last_message_sender_id,
          content: row.last_message_content,
          created_at: row.last_message_at,
          deleted_at: row.last_message_deleted_at,
        }
      : null,
  }));
};

const updateConversation = async ({
  id,
  updates,
  executor = db,
}: {
  id: string;
  updates: ConversationUpdateInput;
  executor?: DBExecutor;
}) => {
  return updateTable("conversations", id, updates, {
    executor,
  });
};

const deleteConversation = async ({
  id,
  executor = db,
}: {
  id: string;
  executor?: DBExecutor;
}) => {
  const result = await executor.query(
    `
    UPDATE conversations
    SET deleted_at = NOW(), updated_at = NOW()
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

const updateLastMessage = async ({
  conversationId,
  messageId,
  createdAt,
  executor = db,
}: {
  conversationId: string;
  messageId: string;
  createdAt: Date;
  executor?: DBExecutor;
}): Promise<Conversation> => {
  const result = await executor.query(
    `
    UPDATE conversations
    SET last_message_id = $2,
        last_message_at = $3,
        updated_at = NOW()
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING *
    `,
    [conversationId, messageId, createdAt],
  );
  return result.rows[0];
};

const exists = async ({
  conversationId,
  executor = db,
}: {
  conversationId: string;
  executor?: DBExecutor;
}): Promise<boolean> => {
  const result = await executor.query(
    `SELECT EXISTS (
      SELECT 1
      FROM conversations
      WHERE id = $1
        AND deleted_at IS NULL
    )`,
    [conversationId],
  );

  return result.rows[0].exists;
};

const isGroup = async ({
  conversationId,
  executor = db,
}: {
  conversationId: string;
  executor?: DBExecutor;
}): Promise<boolean> => {
  const result = await executor.query(
    `SELECT type FROM conversations WHERE id = $1 AND deleted_at IS NULL`,
    [conversationId],
  );
  return result.rows[0]?.type === "group";
};

const getCreator = async (
  conversationId: string,
  executor: DBExecutor = db,
): Promise<string | null> => {
  const result = await executor.query(
    `SELECT created_by_user_id FROM conversations WHERE id = $1 AND deleted_at IS NULL`,
    [conversationId],
  );
  return result.rows[0]?.created_by_user_id ?? null;
};

const isOwner = async ({
  conversationId,
  userId,
  executor = db,
}: {
  conversationId: string;
  userId: string;
  executor?: DBExecutor;
}): Promise<boolean> => {
  const result = await executor.query(
    `
    SELECT 1
    FROM conversation_members
    WHERE conversation_id = $1
      AND user_id = $2
      AND role = 'owner'
    `,
    [conversationId, userId],
  );
  return (result.rowCount ?? 0) > 0;
};

const isAdmin = async ({
  conversationId,
  userId,
  executor = db,
}: {
  conversationId: string;
  userId: string;
  executor?: DBExecutor;
}): Promise<boolean> => {
  const result = await executor.query(
    `
    SELECT 1
    FROM conversation_members
    WHERE conversation_id = $1
      AND user_id = $2
      AND role = 'admin'
    `,
    [conversationId, userId],
  );
  return (result.rowCount ?? 0) > 0;
};

export const conversationRepository = {
  create,
  findById,
  createMember,
  findDirectConversation,
  findUserConversations,
  updateConversation,
  deleteConversation,
  updateLastMessage,
  exists,
  isGroup,
  getCreator,
  isAdmin,
  isOwner,
};
