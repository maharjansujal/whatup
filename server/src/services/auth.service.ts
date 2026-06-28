import bcrypt from "bcrypt";
import { pool } from "../db";
import { generateToken } from "../utils/jwt";
import { User } from "../types/user";

const SALT_ROUNDS = 10;

export async function registerUserService({
  username,
  name,
  password,
  image,
}: {
  username: string;
  name: string;
  password: string;
  image: string;
}) {
  if (!username || !name || !password) {
    throw new Error("Missing required fields");
  }
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE username = $1",
    [username],
  );
  if (existingUser.rows.length > 0) {
    throw new Error("Username already exists");
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query(
    "INSERT INTO users (username, name, password_hash, image) VALUES ($1, $2, $3, $4) RETURNING id, name, username, image",
    [username, name, passwordHash, image],
  );
  return result.rows[0];
}

export const loginUserService = async (username: string, password: string) => {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE username = $1",
    [username],
  );

  const user = result.rows[0];
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ id: user.id, username: user.username });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
    },
  };
};
