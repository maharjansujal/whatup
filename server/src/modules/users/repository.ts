import {
  USER_AUTH_COLUMNS,
  USER_PUBLIC_COLUMNS,
} from "../../shared/constants/publicColumns";
import { db, DbExecutor } from "../../shared/db";
import { updateTable } from "../../shared/utils/updateTable";
import { UpdateUserDto, User } from "./types";

export const getAllUsers = async (): Promise<User[]> => {
  const result = await db.query(`SELECT * FROM users`);
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
  const result = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
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

export const uploadAvatar = async ({
  id,
  avatar_url,
  executor = db,
}: {
  id: string;
  avatar_url: string;
  executor: DbExecutor;
}) => {
  const result = await executor.query(
    `UPDATE users SET avatar_url = $2 WHERE id = $1 RETURNING *`,
    [id, avatar_url],
  );
  return result.rows[0];
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

const updateAvatar = async ({
  userId,
  avatar_url,
  avatar_public_id,
}: {
  userId: string;
  avatar_url: string | null;
  avatar_public_id: string | null;
}) => {
  const result = await db.query(
    `UPDATE users
     SET avatar_url = $2,
         avatar_public_id = $3,
         updated_at = NOW()
     WHERE id = $1
     RETURNING ${USER_PUBLIC_COLUMNS}`,
    [userId, avatar_url, avatar_public_id],
  );

  return result.rows[0];
};

const updatePassword = async ({
  userId,
  password,
}: {
  userId: string;
  password: string;
}) => {
  const result = await db.query(
    `UPDATE users
     SET password_hash = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING ${USER_PUBLIC_COLUMNS}`,
    [userId, password],
  );

  return result.rows[0];
};

const updateBio = async (userId: string, bio: string): Promise<User> => {
  const result = await db.query(
    `UPDATE users 
     SET bio = $2, updated_at = now() 
     WHERE id = $1 
     RETURNING ${USER_PUBLIC_COLUMNS.join(", ")}`,
    [userId, bio],
  );
  return result.rows[0];
};

const softDelete = async (userId: string): Promise<User> => {
  const result = await db.query(
    `UPDATE users 
     SET deleted_at = now(), updated_at = now() 
     WHERE id = $1 
     RETURNING ${USER_PUBLIC_COLUMNS.join(", ")}`,
    [userId],
  );
  return result.rows[0];
};

const exists = async (userId: string): Promise<boolean> => {
  const result = await db.query(
    `SELECT 1 FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [userId],
  );
  return (result.rowCount ?? 0) > 0;
};

export const userRepository = {
  getAllUsers,
  findByEmail,
  findByUsername,
  findById,
  update,
  searchUser,
  updateBio,
  updateAvatar,
  updatePassword,
  softDelete,
  exists,
};
