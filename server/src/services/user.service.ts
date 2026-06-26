import { pool } from "../db";

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
    password_hash?: string;
    image?: string | null;
  };
}) => {
  const setClauses: string[] = ["updated_at = CURRENT_TIMESTAMP"];
  const values: (string | number | null)[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (
      ["username", "name", "password_hash", "image"].includes(key) &&
      value !== undefined
    ) {
      setClauses.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
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
