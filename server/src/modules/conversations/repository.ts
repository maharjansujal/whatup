import { db } from "../../shared/db";
import { updateTable } from "../../shared/utils/updateTable";
import { Member } from "../members/types";
import {
  Conversation,
  ConversationUpdateInput,
  CreateConversationInput,
  CreateMemberInput,
} from "./types";

const create = async ({
  type,
  createdByUserId,
  name,
}: CreateConversationInput) => {
  const result = await db.query(
    "INSERT INTO conversations (type, created_by_user_id, name) VALUES ($1, $2, $3) RETURNING *",
    [type, createdByUserId, name ?? null],
  );

  return result.rows[0];
};

const findById = async (id: string): Promise<Conversation> => {
  const result = await db.query(
    "SELECT * FROM conversations WHERE id = $1 AND deleted_at IS NULL",
    [id],
  );
  return result.rows[0];
};

const createMember = async ({
  conversationId,
  userId,
  role = "member",
}: CreateMemberInput): Promise<Member> => {
  const result = await db.query(
    "INSERT INTO conversation_members (conversation_id, user_id, role) VALUES ($1, $2, $3) RETURNING *",
    [conversationId, userId, role],
  );

  return result.rows[0];
};

const findDirectConversation = async (userId1: string, userId2: string) => {
  const result = await db.query(
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

const findUserConversations = async (userId: string) => {
  const result = await db.query(
    `
    SELECT
      c.*,
      cm.role,
      cm.is_muted,
      cm.is_archived
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
}: {
  id: string;
  updates: ConversationUpdateInput;
}) => {
  const result = await updateTable("conversations", id, updates);
  return result;
};

const deleteConversation = async (id: string): Promise<Conversation> => {
  const result = await db.query(
    "UPDATE conversations SET deleted_at = NOW() WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};

export const conversationRepository = {
  create,
  findById,
  createMember,
  findDirectConversation,
  findUserConversations,
  updateConversation,
  deleteConversation,
};
