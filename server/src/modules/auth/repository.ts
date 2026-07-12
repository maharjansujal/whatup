import {
  USER_AUTH_COLUMNS,
  USER_PUBLIC_COLUMNS,
} from "../../shared/constants/publicColumns";
import { db } from "../../shared/db";
import { RegisterDto } from "./validator";

const create = async (
  data: RegisterDto & {
    avatar_url: string | null;
    avatar_public_id: string | null;
  },
) => {
  const result = await db.query(
    `INSERT INTO users(
      username,
      display_name,
      email,
      password_hash,
      avatar_url,
      avatar_public_id
    )
    VALUES($1,$2,$3,$4,$5,$6)
    RETURNING ${USER_AUTH_COLUMNS}`,
    [
      data.username,
      data.display_name,
      data.email,
      data.password,
      data.avatar_url,
      data.avatar_public_id,
    ],
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
    `UPDATE users SET password_hash = $2 WHERE id = $1 RETURNING ${USER_PUBLIC_COLUMNS}`,
    [userId, password],
  );
  return result.rows[0];
};

const updateLastSeen = async (userId: string) => {
  const result = await db.query(
    `UPDATE users SET last_seen_at = NOW() WHERE id = $1 RETURNING ${USER_PUBLIC_COLUMNS}`,
    [userId],
  );
  return result.rows[0];
};

export const authRepository = {
  create,
  updatePassword,
  updateLastSeen,
};
