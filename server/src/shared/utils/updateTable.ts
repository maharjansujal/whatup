import { Pool } from "undici-types";
import { db } from "../db";
import { PoolClient } from "pg";

type DBExecutor = {
  query: (text: string, params?: any[]) => Promise<any>;
};

interface Database {
  users: {
    id: number;
    username: string;
    display_name: string | null;
    email: string;
    password_hash: string;
    avatar_url: string | null;
    bio: string | null;
    last_seen_at: Date | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };

  conversations: {
    id: number;
    type: "group" | "direct";
    name: string | null;
    description: string | null;
    image_url: string | null;
    created_by_user_id: number;
    last_message_id: number | null;
    last_message_at: Date | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  };

  conversation_members: {
    id: number;
    conversation_id: number;
    user_id: number;
    role: "owner" | "admin" | "member";
    joined_at: Date;
    last_read_message_id: number | null;
    last_read_at: Date | null;
    muted_until: boolean;
    is_archived: boolean;
    nickname: string | null;
  };

  messages: {
    id: number;
    conversation_id: number;
    sender_id: number | null;
    type: "text" | "image" | "file" | "system";
    content: string | null;
    reply_to_message_id: number | null;
    edited_at: Date | null;
    deleted_at: Date | null;
    created_at: Date;
  };
}
type Update<T extends keyof Database> = Partial<Omit<Database[T], "id">>;

export async function updateTable<T extends keyof Database>(
  table: T,
  id: number | string,
  updateDto: Update<T>,
  options: {
    publicColumns?: ReadonlyArray<keyof Database[T]>;
    executor?: DBExecutor;
  } = {},
) {
  const { publicColumns, executor = db } = options;

  if (Object.keys(updateDto).length === 0) {
    throw new Error("No fields to update");
  }

  const returning = publicColumns?.join(", ") ?? "*";

  const updates: string[] = [];
  const values: unknown[] = [];

  let index = 1;

  for (const [key, value] of Object.entries(updateDto)) {
    if (value !== undefined) {
      updates.push(`${key} = $${index++}`);
      values.push(value);
    }
  }

  updates.push("updated_at = NOW()");
  values.push(id);

  const stmt = `
    UPDATE ${table}
    SET ${updates.join(", ")}
    WHERE id = $${index}
    RETURNING ${returning}
  `;

  const result = await executor.query(stmt, values);

  return result.rows[0];
}
