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
