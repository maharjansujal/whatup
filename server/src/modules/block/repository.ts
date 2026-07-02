import { BlockedUsers, CreateBlockInput } from "./types";
import { db } from "../../shared/db";

const createBlock = async ({ blocker_id, blocked_id }: CreateBlockInput) => {
  const result = await db.query(
    "INSERT INTO user_blocks (blocker_id, blocked_id) VALUES ($1, $2) RETURNING *",
    [blocker_id, blocked_id],
  );
  return result.rows[0];
};

const removeBlock = async ({ blocker_id, blocked_id }: CreateBlockInput) => {
  const result = await db.query(
    "DELETE FROM user_blocks WHERE blocker_id = $1 AND blocked_id = $2 RETURNING *",
    [blocker_id, blocked_id],
  );
  return result.rows[0];
};

const isBlocked = async ({
  blocker_id,
  blocked_id,
}: {
  blocker_id: string;
  blocked_id: string;
}): Promise<boolean> => {
  const result = await db.query(
    "SELECT EXISTS (SELECT 1 FROM user_blocks WHERE blocker_id = $1 AND blocked_id = $2) AS blocked",
    [blocker_id, blocked_id],
  );
  return result.rows[0].blocked;
};

const isBlockedBetween = async ({
  userA,
  userB,
}: {
  userA: string;
  userB: string;
}): Promise<boolean> => {
  const result = await db.query(
    "SELECT EXISTS (SELECT 1 FROM user_blocks WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1)) AS blocked",
    [userA, userB],
  );
  return result.rows[0].blocked;
};

const getBlockedUsers = async (blocker_id: string): Promise<BlockedUsers[]> => {
  const result = await db.query(
    `SELECT u.username, u.display_name, u.avatar_url FROM users u JOIN user_blocks ub ON u.id = ub.blocked_id WHERE ub.blocker_id = $1`,
    [blocker_id],
  );
  return result.rows;
};

export const blockRepository = {
  createBlock,
  removeBlock,
  isBlocked,
  isBlockedBetween,
  getBlockedUsers,
};
