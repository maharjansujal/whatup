import { createAppError } from "../../shared/errors/appError";
import { blockRepository } from "./repository";

const blockUser = async ({
  blocker_id,
  blocked_id,
}: {
  blocker_id: string;
  blocked_id: string;
}) => {
  if (blocker_id === blocked_id) {
    throw createAppError("You cannot block yourself", 400);
  }
  const result = await blockRepository.createBlock({ blocked_id, blocker_id });
  return result;
};

const unblockUser = async ({
  blocker_id,
  blocked_id,
}: {
  blocker_id: string;
  blocked_id: string;
}) => {
  const result = await blockRepository.removeBlock({ blocked_id, blocker_id });
  return result;
};

const canCommunicate = async ({
  userA,
  userB,
}: {
  userA: string;
  userB: string;
}) => {
  const isBlocked = await blockRepository.isBlockedBetween({ userA, userB });
  return !isBlocked;
};

const getBlockedUsers = async (blocker_id: string) => {
  const result = await blockRepository.getBlockedUsers(blocker_id);
  return result;
};

export const blockService = {
  blockUser,
  unblockUser,
  canCommunicate,
  getBlockedUsers,
};
