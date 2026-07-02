import { asyncHandler } from "../../shared/utils/asyncHandler";
import { conversationService } from "./service";

const createConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const userId = req.body.id;

  const result = await conversationService.createDirectConversation({
    currentUserId: String(currentUserId),
    otherUserId: userId,
  });
  return res.status(201).json(result);
});

const createGroupConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const otherUserIds = req.body.id;
  const result = await conversationService.createGroupConversation({
    currentUserId: currentUserId.toString(),
    otherUserIds: otherUserIds,
  });
});

const updateConversation = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const updates = req.body;
  const userId = req.user.id;

  const result = await conversationService.updateConversation({
    id: String(conversationId),
    updates,
    userId,
  });
  return res.status(200).json(result);
});

const deleteConversation = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const result = await conversationService.deleteConversation(
    conversationId.toString(),
  );
  return res.status(200).json(result);
});

export const conversationController = {
  createConversation,
  createGroupConversation,
  updateConversation,
  deleteConversation,
};
