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
  const { groupName, member_ids } = req.body;
  const result = await conversationService.createGroupConversation({
    groupName,
    currentUserId: currentUserId.toString(),
    otherUserIds: member_ids,
  });
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

const getConversationById = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const result = await conversationService.getConversationById(
    conversationId.toString(),
  );
  return res.status(200).json(result);
});

const listUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await conversationService.listUserConversations(userId);
  return res.status(200).json(result);
});

const updateLastMessage = asyncHandler(async (req, res) => {
  const { conversationId, messageId, createdAt } = req.body;
  const result = await conversationService.updateLastMessage({
    conversationId,
    messageId,
    createdAt,
  });
  return res.status(200).json(result);
});

const exists = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const result = await conversationService.exists(conversationId.toString());
  return res.status(200).json({ exists: result });
});

const isGroup = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const result = await conversationService.isGroup(conversationId.toString());
  return res.status(200).json({ isGroup: result });
});

const getCreator = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const result = await conversationService.getCreator(
    conversationId.toString(),
  );
  return res.status(200).json({ creatorId: result });
});

export const conversationController = {
  createConversation,
  createGroupConversation,
  updateConversation,
  deleteConversation,
  getConversationById,
  listUserConversations,
  updateLastMessage,
  exists,
  isGroup,
  getCreator,
};
