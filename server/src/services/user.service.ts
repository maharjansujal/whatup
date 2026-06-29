import { pool } from "../db";
import bcrypt from "bcrypt";
import { Status, User } from "../types/user";

export const getUsersService = async (userId: number) => {
  const result = await pool.query(
    `SELECT 
    u.id, 
    u.name, 
    u.username,
    u.custom_status,
    lm.content AS last_message,
    lm.sender_id AS last_message_sender_id,
    lm.status AS last_message_status,
    lm.created_at AS last_message_time
    FROM users u
    LEFT JOIN LATERAL (
        SELECT content, sender_id, status, created_at
        FROM messages
        WHERE (sender_id = $1 AND receiver_id = u.id)
          OR (sender_id = u.id AND receiver_id = $1)
        ORDER BY created_at DESC
        LIMIT 1
    ) lm ON true
    WHERE u.id != $1
    ORDER BY COALESCE(lm.created_at, '1970-01-01'::timestamp) DESC`, // Order by created_at so that user whom you communicate the most comes at the top of the list
    [userId],
  );
  return result.rows;
};

export const getUserByIdService = async (userId: number) => {
  const result = await pool.query<User>(
    "SELECT id, name, username, image FROM users WHERE id = $1",
    [userId],
  );
  if (!result.rowCount) {
    throw new Error("User does not exist");
  }
  return result.rows[0];
};

export const updateUserService = async ({
  id,
  updates,
}: {
  id: number;
  updates: {
    username?: string;
    name?: string;
    password?: string;
    image?: string | null;
  };
}) => {
  const setClauses: string[] = ["updated_at = CURRENT_TIMESTAMP"];
  const values: (string | number | null)[] = [];
  let paramIndex = 1;

  if (updates.username !== undefined) {
    setClauses.push(`username = $${paramIndex++}`);
    values.push(updates.username);
  }

  if (updates.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }

  if (updates.password) {
    const passwordHash = await bcrypt.hash(updates.password, 10);

    setClauses.push(`password_hash = $${paramIndex++}`);
    values.push(passwordHash);
  }

  if (updates.image !== undefined) {
    setClauses.push(`image = $${paramIndex++}`);
    values.push(updates.image);
  }

  if (values.length === 0) {
    const fallbackResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id],
    );
    return fallbackResult.rows[0];
  }

  values.push(id);

  const query = `
    UPDATE users
    SET ${setClauses.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateStatusService = async (id: number, customStatus: Status) => {
  const result = await pool.query(
    "UPDATE users SET custom_status = $2 WHERE id = $1 RETURNING *",
    [id, customStatus],
  );
  return result.rows[0];
};

export const updateLastSeenAtService = async (id: number) => {
  await pool.query("UPDATE users SET last_seen_at = NOW() WHERE id = $1", [id]);
};
