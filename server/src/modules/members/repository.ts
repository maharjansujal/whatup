import { db } from "../../shared/db";
import { createAppError } from "../../shared/errors/appError";
import { CreateMemberInput, Member } from "./types";
import { Pool, PoolClient } from "pg";

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

const deleteMember = async (
  {
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  },
  executor: DBExecutor = db,
): Promise<Member> => {
  const result = await executor.query(
    "DELETE FROM conversation_members WHERE conversation_id = $1 AND user_id = $2 RETURNING *",
    [conversationId, userId],
  );
  return result.rows[0];
};

const promoteMember = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}): Promise<Member> => {
  const result = await db.query(
    "UPDATE conversation_members SET role = 'admin' WHERE conversation_id = $1 AND user_id = $2 RETURNING *",
    [conversationId, userId],
  );
  return result.rows[0];
};

const demoteMember = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}): Promise<Member> => {
  const result = await db.query(
    "UPDATE conversation_members SET role = 'member' WHERE conversation_id = $1 AND user_id = $2 RETURNING *",
    [conversationId, userId],
  );
  return result.rows[0];
};

const getAllMembers = async (conversationId: string) => {
  const result = await db.query(
    `SELECT u.username, u.display_name, cm.nickname, u.avatar_url, cm."role", u.bio 
    FROM users u
    JOIN conversation_members cm ON u.id = cm.user_id
    WHERE cm.conversation_id = $1`,
    [conversationId],
  );
  return result.rows;
};

const getMemberById = async (
  {
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  },
  executor: DBExecutor = db,
) => {
  const result = await executor.query(
    `SELECT u.username, u.display_name, cm.nickname, u.avatar_url, cm."role", u.bio
     FROM users u
     JOIN conversation_members cm ON u.id = cm.user_id
     WHERE cm.conversation_id = $1 AND u.id = $2`,
    [conversationId, userId],
  );

  return result.rows[0];
};

const isMember = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}): Promise<boolean> => {
  const result = await db.query(
    "SELECT EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = $1 AND user_id = $2)",
    [conversationId, userId],
  );
  return result.rows[0].exists;
};

const updateLastRead = async ({
  lastReadMessageId,
  conversationId,
  userId,
}: {
  lastReadMessageId: string;
  conversationId: string;
  userId: string;
}): Promise<Member> => {
  const result = await db.query(
    "UPDATE conversation_members SET last_read_message_id = $1, last_read_at = NOW() WHERE conversation_id = $2 AND user_id = $3 RETURNING *",
    [lastReadMessageId, conversationId, userId],
  );
  return result.rows[0];
};

const updateNickname = async ({
  conversation_id,
  nickname,
  user_id,
}: {
  conversation_id: string;
  nickname: string;
  user_id: string;
}) => {
  const result = await db.query(
    "UPDATE conversation_members SET nickname = $2 WHERE conversation_id = $1 AND user_id = $3 RETURNING *",
    [conversation_id, nickname, user_id],
  );
  return result.rows[0];
};

const muteConversation = async ({
  conversation_id,
  user_id,
}: {
  conversation_id: string;
  user_id: string;
}) => {
  const result = await db.query(
    "UPDATE conversation_members SET is_muted = TRUE WHERE conversation_id = $1 AND user_id = $2 RETURNING *",
    [conversation_id, user_id],
  );
  return result.rows[0];
};

const archiveConversation = async ({
  conversation_id,
  user_id,
}: {
  conversation_id: string;
  user_id: string;
}) => {
  const result = await db.query(
    "UPDATE conversation_members SET is_archived = TRUE WHERE conversation_id = $1 AND user_id = $2 RETURNING *",
    [conversation_id, user_id],
  );
  return result.rows[0];
};

const countMembers = async (conversationId: string): Promise<number> => {
  const result = await db.query(
    "SELECT COUNT(*) FROM conversation_members WHERE conversation_id = $1",
    [conversationId],
  );
  return parseInt(result.rows[0].count, 10);
};

const getMemberIds = async (conversationId: string): Promise<string[]> => {
  const result = await db.query(
    "SELECT user_id FROM conversation_members WHERE conversation_id = $1",
    [conversationId],
  );
  return result.rows.map((row) => row.user_id);
};

type DBExecutor = Pool | PoolClient;

const listArchivedChats = async (
  userId: string,
  executor: DBExecutor = db,
): Promise<Member[]> => {
  const result = await executor.query(
    `SELECT * FROM conversation_members
     WHERE user_id = $1 AND is_archived = TRUE`,
    [userId],
  );
  return result.rows;
};

const listMuted = async (
  userId: string,
  executor: DBExecutor = db,
): Promise<Member[]> => {
  const result = await executor.query(
    `SELECT * FROM conversation_members
     WHERE user_id = $1 AND is_muted = TRUE`,
    [userId],
  );
  return result.rows;
};

const getUserConversationIds = async (
  userId: string,
  executor: DBExecutor = db,
): Promise<string[]> => {
  const result = await executor.query(
    `SELECT conversation_id FROM conversation_members
     WHERE user_id = $1`,
    [userId],
  );
  return result.rows.map((r) => r.conversation_id);
};

const countArchived = async (
  userId: string,
  executor: DBExecutor = db,
): Promise<number> => {
  const result = await executor.query(
    `SELECT COUNT(*) FROM conversation_members
     WHERE user_id = $1 AND is_archived = TRUE`,
    [userId],
  );
  return parseInt(result.rows[0].count, 10);
};

const countMuted = async (
  userId: string,
  executor: DBExecutor = db,
): Promise<number> => {
  const result = await executor.query(
    `SELECT COUNT(*) FROM conversation_members
     WHERE user_id = $1 AND is_muted = TRUE`,
    [userId],
  );
  return parseInt(result.rows[0].count, 10);
};

export const memberRepository = {
  createMember,
  deleteMember,
  promoteMember,
  demoteMember,
  getAllMembers,
  getMemberById,
  isMember,
  updateLastRead,
  updateNickname,
  muteConversation,
  archiveConversation,
  countMembers,
  getMemberIds,
  listArchivedChats,
  listMuted,
  getUserConversationIds,
  countArchived,
  countMuted,
};
