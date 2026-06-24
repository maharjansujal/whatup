import { pool } from "../db";

export const registerUserService = async (username: string, name: string) => {
  const result = await pool.query(
    "INSERT INTO users (username, name) VALUES ($1, $2) RETURNING *",
    [username, name],
  );
  return result.rows[0];
};

export const getUsersService = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

export const getUserByIdService = async (userId: number) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  if (!result.rowCount) {
    throw new Error("User does not exist");
  }
  return result.rows[0];
};
