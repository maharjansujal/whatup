import { asyncHandler } from "../../shared/utils/asyncHandler";
import { getIO, onlineUsers } from "../../socket";
import { SOCKET_EVENTS } from "../../socket/socket_events";
import { conversationService } from "./service";

const createConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const userId = req.body.userId;

  const result = await conversationService.createDirectConversation({
    currentUserId: String(currentUserId),
    otherUserId: userId,
  });
  const io = getIO();

  console.log("Emitting conversation to:", `user:${userId}`);
  console.log(result.receiverConversation);

  io.to(`user:${userId}`).emit(
    SOCKET_EVENTS.CONVERSATION_CREATED,
    result.receiverConversation,
  );

  const memberIds = result.memberIds;

  for (const memberId of memberIds) {
    const sockets = onlineUsers.get(memberId);

    if (!sockets) continue;

    for (const socketId of sockets) {
      io.sockets.sockets.get(socketId)?.join(result.senderConversation?.id);
    }
  }

  console.log("Conversation emitted.");

  return res.status(201).json(result.senderConversation);
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

export const conversationController = {
  createConversation,
  createGroupConversation,
  updateConversation,
  deleteConversation,
  getConversationById,
  listUserConversations,
};
