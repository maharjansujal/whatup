import { db, DbExecutor } from "../../shared/db";
import { Receipt } from "./types";

const createReceipt = async ({
  messageId,
  userId,
  executor = db,
}: {
  messageId: string;
  userId: string;
  executor?: DbExecutor;
}): Promise<Receipt> => {
  const result = await executor.query(
    `
    INSERT INTO message_receipts (message_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (message_id, user_id) DO NOTHING
    RETURNING *
    `,
    [messageId, userId],
  );
  return result.rows[0];
};

const markDelivered = async (
  messageId: string,
  userId: string,
  executor: DbExecutor = db,
): Promise<Receipt> => {
  const result = await executor.query(
    `
    UPDATE message_receipts
    SET delivered_at = NOW()
    WHERE message_id = $1 AND user_id = $2
    RETURNING *
    `,
    [messageId, userId],
  );
  return result.rows[0];
};

const markAllDelivered = async ({
  userId,
  executor = db,
}: {
  userId: string;
  executor?: DbExecutor;
}) => {
  const result = await executor.query(
    `
        UPDATE message_receipts mr
SET delivered_at = NOW()
FROM messages m
WHERE mr.message_id = m.id
  AND mr.user_id = $1
  AND mr.delivered_at IS NULL
RETURNING
  mr.message_id,
  mr.user_id,
  mr.delivered_at,
  m.sender_id;
    `,
    [userId],
  );
  return result.rows;
};

const markSeen = async (
  messageId: string,
  userId: string,
  executor: DbExecutor = db,
): Promise<Receipt> => {
  const result = await executor.query(
    `
    UPDATE message_receipts
    SET seen_at = NOW()
    WHERE message_id = $1 AND user_id = $2
    RETURNING *
    `,
    [messageId, userId],
  );
  return result.rows[0];
};

const getReceipts = async (
  messageId: string,
  executor: DbExecutor = db,
): Promise<Receipt[]> => {
  const result = await executor.query(
    `
    SELECT *
    FROM message_receipts
    WHERE message_id = $1
    `,
    [messageId],
  );
  return result.rows;
};

const getSeenUsers = async (
  messageId: string,
  executor: DbExecutor = db,
): Promise<{ user_id: string; seen_at: Date }[]> => {
  const result = await executor.query(
    `
    SELECT user_id, seen_at
    FROM message_receipts
    WHERE message_id = $1 AND seen_at IS NOT NULL
    `,
    [messageId],
  );
  return result.rows;
};

const getDeliveredUsers = async (
  messageId: string,
  executor: DbExecutor = db,
): Promise<{ user_id: string; delivered_at: Date }[]> => {
  const result = await executor.query(
    `
    SELECT user_id, delivered_at
    FROM message_receipts
    WHERE message_id = $1 AND delivered_at IS NOT NULL
    `,
    [messageId],
  );
  return result.rows;
};

export const receiptsRepository = {
  createReceipt,
  markDelivered,
  markAllDelivered,
  markSeen,
  getReceipts,
  getSeenUsers,
  getDeliveredUsers,
};
