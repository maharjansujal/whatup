import { USER_AUTH_COLUMNS } from "../../shared/constants/publicColumns";
import { db } from "../../shared/db";
import { RegisterDto } from "./validator";

async function findByEmail(email: string) {
  const result = await db.query(
    `SELECT ${USER_AUTH_COLUMNS} FROM users WHERE email = $1`,
    [email],
  );

  return result.rows[0];
}

async function findByUsername(username: string) {
  const result = await db.query(
    `SELECT ${USER_AUTH_COLUMNS} FROM users WHERE username = $1`,
    [username],
  );

  return result.rows[0];
}

async function create(data: RegisterDto) {
  const result = await db.query(
    `INSERT INTO users(username, display_name, email, password_hash) VALUES($1,$2,$3,$4) RETURNING ${USER_AUTH_COLUMNS}`,
    [data.username, data.display_name, data.email, data.password],
  );

  return result.rows[0];
}

export const authRepository = {
  findByEmail,
  findByUsername,
  create,
};
