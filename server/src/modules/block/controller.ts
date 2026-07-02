import { asyncHandler } from "../../shared/utils/asyncHandler";
import { blockService } from "./service";

const blockUser = asyncHandler(async (req, res) => {
  const blocker_id = req.user.id;
  const { id } = req.body;
  const result = await blockService.blockUser({ blocked_id: id, blocker_id });
  return res.status(201).json(result);
});

const unblockUser = asyncHandler(async (req, res) => {
  const blocker_id = req.user.id;
  const { id } = req.body;
  const result = await blockService.unblockUser({ blocked_id: id, blocker_id });
  return res.status(200).json(result);
});

const canCommunicate = asyncHandler(async (req, res) => {
  const userA = req.user.id;
  const { userB } = req.body;
  const result = await blockService.canCommunicate({ userA, userB });
  return res.status(200).json(result);
});

const getBlockedUsers = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await blockService.getBlockedUsers(userId);
  return res.status(200).json(result);
});

export const blockController = {
  blockUser,
  unblockUser,
  canCommunicate,
  getBlockedUsers,
};
