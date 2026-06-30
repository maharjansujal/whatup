import { db } from "../../shared/db";
import { User } from "./types";

export const getAllUsers = async (): Promise<User[]> => {
  const result = await db.query("SELECT * FROM users");
  return result.rows[0];
};

export const userRepository = {
  getAllUsers,
};
