import { db, DbExecutor } from "../../shared/db";
import { ConversationRequest } from "./types";

const createRequest = async (
  data: { conversationId: string; requestorId: string; recipientId: string },
  executor: DbExecutor = db,
): Promise<ConversationRequest> => {
  const result = await executor.query(
    `INSERT INTO conversation_requests (conversation_id, requestor_id, recipient_id, status)
     VALUES ($1, $2, $3, 'pending')
     RETURNING *`,
    [data.conversationId, data.requestorId, data.recipientId],
  );
  return result.rows[0];
};

const findPending = async (
  requestorId: string,
  recipientId: string,
  executor: DbExecutor = db,
): Promise<ConversationRequest | null> => {
  const result = await executor.query(
    `SELECT * FROM conversation_requests
     WHERE requestor_id = $1 AND recipient_id = $2 AND status = 'pending'`,
    [requestorId, recipientId],
  );
  return result.rows[0] || null;
};

const findById = async (
  id: string,
  executor: DbExecutor = db,
): Promise<ConversationRequest | null> => {
  const result = await executor.query(
    `SELECT * FROM conversation_requests WHERE id = $1`,
    [id],
  );
  return result.rows[0] || null;
};

const accept = async (
  id: string,
  executor: DbExecutor = db,
): Promise<ConversationRequest | null> => {
  const result = await executor.query(
    `UPDATE conversation_requests
     SET status = 'accepted', updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id],
  );
  return result.rows[0] || null;
};

// Decline request
const decline = async (
  id: string,
  executor: DbExecutor = db,
): Promise<ConversationRequest | null> => {
  const result = await executor.query(
    `UPDATE conversation_requests
     SET status = 'declined', updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id],
  );
  return result.rows[0] || null;
};

const cancel = async (
  id: string,
  executor: DbExecutor = db,
): Promise<ConversationRequest | null> => {
  const result = await executor.query(
    `UPDATE conversation_requests
     SET status = 'cancelled', updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id],
  );
  return result.rows[0] || null;
};

const listIncoming = async (
  userId: string,
  executor: DbExecutor = db,
): Promise<ConversationRequest[]> => {
  const result = await executor.query(
    `SELECT * FROM conversation_requests
     WHERE recipient_id = $1 AND status = 'pending'
     ORDER BY created_at DESC`,
    [userId],
  );
  return result.rows;
};

const listOutgoing = async (
  userId: string,
  executor: DbExecutor = db,
): Promise<ConversationRequest[]> => {
  const result = await executor.query(
    `SELECT * FROM conversation_requests
     WHERE requestor_id = $1 AND status = 'pending'
     ORDER BY created_at DESC`,
    [userId],
  );
  return result.rows;
};

export const requestsRepository = {
  createRequest,
  findPending,
  findById,
  accept,
  decline,
  cancel,
  listIncoming,
  listOutgoing,
};
