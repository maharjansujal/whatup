import { pool } from "../db";
import bcrypt from "bcrypt";

export const getUsersService = async () => {
  const result = await pool.query(
    "SELECT id, name, username, image FROM users",
  );
  return result.rows;
};

export const getUserByIdService = async (userId: number) => {
  const result = await pool.query(
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
