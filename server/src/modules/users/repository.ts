import { USER_PUBLIC_COLUMNS } from "../../shared/constants/publicColumns";
import { db } from "../../shared/db";
import { updateTable } from "../../shared/utils/updateTable";
import { UpdateUserDto, User } from "./types";

export const getAllUsers = async (): Promise<User[]> => {
  const result = await db.query(
    `SELECT ${USER_PUBLIC_COLUMNS.join(", ")} FROM users`,
  );
  return result.rows;
};

export const getUserById = async (id: string): Promise<User> => {
  const result = await db.query(
    `SELECT ${USER_PUBLIC_COLUMNS.join(", ")} FROM users WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

export const update = async (
  id: string,
  data: UpdateUserDto,
): Promise<User> => {
  const result = await updateTable("users", id, data, USER_PUBLIC_COLUMNS);
  return result;
};

export const userRepository = {
  getAllUsers,
  getUserById,
  update,
};
