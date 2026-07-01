import { createAppError } from "../../shared/errors/appError";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { conversationService } from "./service";

const createConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const userId = req.body.id;

  const result = await conversationService.createDirectConversation(
    String(currentUserId),
    userId,
  );
  return res.status(201).json(result);
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
  updateConversation,
  deleteConversation,
};
