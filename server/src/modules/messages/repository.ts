import { db } from "../../shared/db";

const getConversationMessages = async (userId: string) => {
  const result = await db.query(
    `SELECT m.type, m.content, m.reply_to_message_id, m.updated_at,
    m.created_at, u.username, u.display_name 
    FROM users u JOIN messages m 
    ON m.sender_id = u.id WHERE u.id = $1`,
    [userId],
  );
  return result.rows;
};

export const messagesRepository = {
  getConversationMessages,
};
