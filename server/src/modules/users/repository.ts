import { USER_PUBLIC_COLUMNS } from "../../shared/constants/publicColumns";
import { db } from "../../shared/db";
import { User } from "./types";

export const getAllUsers = async (): Promise<User[]> => {
  const result = await db.query(`SELECT ${USER_PUBLIC_COLUMNS} FROM users`);
  return result.rows[0];
};

export const getUserById = async (id: number): Promise<User> => {
  const result = await db.query(
    `SELECT ${USER_PUBLIC_COLUMNS} FROM users WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

export const userRepository = {
  getAllUsers,
  getUserById,
};
