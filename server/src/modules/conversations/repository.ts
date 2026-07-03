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

const findDirectConversation = async (
  userId1: string,
  userId2: string,
  executor: DBExecutor = db,
): Promise<Conversation | null> => {
  const result = await executor.query(
    `
    SELECT c.*
    FROM conversations c
    JOIN conversation_members cm1
      ON cm1.conversation_id = c.id
    JOIN conversation_members cm2
      ON cm2.conversation_id = c.id
    WHERE c.type = 'direct'
      AND cm1.user_id = $1
      AND cm2.user_id = $2
      AND (
        SELECT COUNT(*)
        FROM conversation_members cm
        WHERE cm.conversation_id = c.id
      ) = 2
    `,
    [userId1, userId2],
  );

  return result.rows[0] ?? null;
};

const findUserConversations = async (
  userId: string,
  executor: DBExecutor = db,
) => {
  const result = await executor.query(
    `
    SELECT c.*, cm.role, cm.is_muted, cm.is_archived
    FROM conversations c
    JOIN conversation_members cm
      ON cm.conversation_id = c.id
    WHERE cm.user_id = $1
      AND c.deleted_at IS NULL
    ORDER BY c.last_message_at DESC NULLS LAST
    `,
    [userId],
  );

  return result.rows;
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

const deleteConversation = async (id: string, executor: DBExecutor = db) => {
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

const updateLastMessage = async (
  conversationId: string,
  messageId: string,
  createdAt: Date,
  executor: DBExecutor = db,
): Promise<Conversation> => {
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

const exists = async (
  conversationId: string,
  executor: DBExecutor = db,
): Promise<boolean> => {
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

const isGroup = async (
  conversationId: string,
  executor: DBExecutor = db,
): Promise<boolean> => {
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

const isOwner = async (
  conversationId: string,
  userId: string,
  executor: DBExecutor = db,
): Promise<boolean> => {
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

const isAdmin = async (
  conversationId: string,
  userId: string,
  executor: DBExecutor = db,
): Promise<boolean> => {
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
