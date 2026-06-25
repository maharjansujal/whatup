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
