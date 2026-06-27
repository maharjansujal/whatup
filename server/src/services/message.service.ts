import { pool } from "../db";

export const createMessageService = async (
  receiverId: number,
  senderId: number,
  content: string,
) => {
  const result = await pool.query(
    "INSERT INTO messages (receiver_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *",
    [receiverId, senderId, content],
  );
  return result.rows[0];
};

export const getConversationMessagesService = async (
  senderId: number,
  receiverId: number,
) => {
  const result = await pool.query(
    "SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at ASC",
    [senderId, receiverId],
  );
  return result.rows;
};

export const getAllMessagesService = async (receiverId: number) => {
  const result = await pool.query(
    "SELECT * FROM messages WHERE receiver_id = $1",
    [receiverId],
  );
  return result.rows;
};

export const updateMessageService = async (
  messageId: number,
  content: string | null,
) => {
  const result = await pool.query(
    `UPDATE messages SET content = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [messageId, content],
  );

  return result.rows[0];
};

export const deleteMessageService = async (messageId: number) => {
  const result = await pool.query("DELETE FROM messages WHERE id = $1", [
    messageId,
  ]);
  return result.rowCount === 1;
};
