import {
  USER_AUTH_COLUMNS,
  USER_PUBLIC_COLUMNS,
} from "../../shared/constants/publicColumns";
import { db } from "../../shared/db";
import { updateTable } from "../../shared/utils/updateTable";
import { UpdateUserDto, User } from "./types";

export const getAllUsers = async (): Promise<User[]> => {
  const result = await db.query(
    `SELECT ${USER_PUBLIC_COLUMNS.join(", ")} FROM users`,
  );
  return result.rows;
};

const findByEmail = async (email: string) => {
  const result = await db.query(
    `SELECT ${USER_AUTH_COLUMNS} FROM users WHERE email = $1`,
    [email],
  );

  return result.rows[0];
};

const findByUsername = async (username: string) => {
  const result = await db.query(
    `SELECT ${USER_AUTH_COLUMNS} FROM users WHERE username = $1`,
    [username],
  );

  return result.rows[0];
};

export const findById = async (id: string): Promise<User> => {
  const result = await db.query(
    `SELECT ${USER_PUBLIC_COLUMNS.join(", ")} FROM users WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

export const update = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateUserDto;
}): Promise<User> => {
  const result = await updateTable("users", id, data, {
    publicColumns: USER_PUBLIC_COLUMNS,
  });
  return result;
};

const searchUser = async ({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): Promise<User[]> => {
  const result = await db.query(
    `SELECT ${USER_PUBLIC_COLUMNS.join(", ")}
   FROM users
   WHERE username ILIKE $1
     AND email ILIKE $2`,
    [`%${username}%`, `%${email}% AND id <> $2`],
  );
  return result.rows;
};

export const userRepository = {
  getAllUsers,
  findByEmail,
  findByUsername,
  findById,
  update,
  searchUser,
};
