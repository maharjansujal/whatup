import { USER_PUBLIC_COLUMNS } from "../../shared/constants/publicColumns";
import { db } from "../../shared/db";
import { UpdateUserDto, User } from "./types";

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

export const update = async (
  id: number,
  data: UpdateUserDto,
): Promise<User> => {
  const updates: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (data.username !== undefined) {
    updates.push(`username = $${index++}`);
    values.push(data.username);
  }

  if (data.display_name !== undefined) {
    updates.push(`display_name = $${index++}`);
    values.push(data.display_name);
  }

  if (data.bio !== undefined) {
    updates.push(`bio = $${index++}`);
    values.push(data.bio); // may be null
  }

  if (data.avatar_url !== undefined) {
    updates.push(`avatar_url = $${index++}`);
    values.push(data.avatar_url); // may be null
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  updates.push(`updated_at = NOW()`);

  console.log("updates", updates);

  values.push(id);

  const result = await db.query(
    `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${index}
      RETURNING ${USER_PUBLIC_COLUMNS}
    `,
    values,
  );

  return result.rows[0];
};

export const userRepository = {
  getAllUsers,
  getUserById,
  update,
};
