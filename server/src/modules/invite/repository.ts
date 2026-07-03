import { Pool, PoolClient } from "pg";
import { db } from "../../shared/db";
import { Invite } from "./types";

type DBExecutor = Pool | PoolClient;

// Create a new invite
const createInvite = async (
  data: {
    conversationId: string;
    code: string;
    createdByUserId: string;
    maxUses?: number;
    expiresAt?: Date;
  },
  executor: DBExecutor = db,
): Promise<Invite> => {
  const result = await executor.query(
    `INSERT INTO conversation_invites (conversation_id, code, created_by_user_id, max_uses, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.conversationId,
      data.code,
      data.createdByUserId,
      data.maxUses ?? null,
      data.expiresAt ?? null,
    ],
  );
  return result.rows[0];
};

// Find invite by code
const findByCode = async (
  code: string,
  executor: DBExecutor = db,
): Promise<Invite | null> => {
  const result = await executor.query(
    `SELECT * FROM conversation_invites
     WHERE code = $1 AND deleted_at IS NULL`,
    [code],
  );
  return result.rows[0] ?? null;
};

// Increment usage count
const incrementUsage = async (
  inviteId: string,
  executor: DBExecutor = db,
): Promise<Invite> => {
  const result = await executor.query(
    `UPDATE conversation_invites
     SET uses = uses + 1, updated_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING *`,
    [inviteId],
  );
  return result.rows[0];
};

// Deactivate invite (soft disable)
const deactivate = async (
  inviteId: string,
  executor: DBExecutor = db,
): Promise<Invite> => {
  const result = await executor.query(
    `UPDATE conversation_invites
     SET is_active = FALSE, updated_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING *`,
    [inviteId],
  );
  return result.rows[0];
};

// Hard delete invite
const deleteInvite = async (
  inviteId: string,
  executor: DBExecutor = db,
): Promise<void> => {
  await executor.query(
    `DELETE FROM conversation_invites
     WHERE id = $1`,
    [inviteId],
  );
};

const listConversation = async (
  conversationId: string,
  executor: DBExecutor = db,
): Promise<Invite[]> => {
  const result = await executor.query(
    `SELECT * FROM conversation_invites
     WHERE conversation_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [conversationId],
  );
  return result.rows;
};

const isValid = async (
  code: string,
  executor: DBExecutor = db,
): Promise<boolean> => {
  const result = await executor.query(
    `
    SELECT *
    FROM conversation_invites
    WHERE code = $1
      AND is_active = TRUE
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (max_uses IS NULL OR uses < max_uses)
    `,
    [code],
  );

  return result.rows.length > 0;
};

export const inviteRepository = {
  createInvite,
  findByCode,
  incrementUsage,
  deactivate,
  deleteInvite,
  listConversation,
  isValid,
};
