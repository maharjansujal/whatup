import { asyncHandler } from "../../shared/utils/asyncHandler";
import { getIO } from "../../socket";
import { SOCKET_EVENTS } from "../../socket/socket_events";
import { messageService } from "../messages/service";
import { receiptsService } from "./service";

// Create a receipt entry
const createReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params; // messageId
  const result = await receiptsService.createReceipt({
    messageId: id.toString(),
    userId: req.user.id,
  });
  return res.status(201).json(result);
});

// Mark delivered
const markDelivered = asyncHandler(async (req, res) => {
  const { id } = req.params; // messageId
  const receiverId = req.user.id;

  const receipt = await receiptsService.markDelivered({
    messageId: id.toString(),
    userId: receiverId,
  });

  console.log({
    id,
    receiverId,
  });

  const message = await messageService.getMessageById(id.toString());

  getIO()
    .to(`user:${message.sender_id}`)
    .emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
      messageId: id.toString(),
      userId: receiverId,
      deliveredAt: receipt.delivered_at,
    });

  return res.status(200).json(receipt);
});

// Mark seen
const markSeen = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const receiverId = req.user.id;

  const receipt = await receiptsService.markSeen({
    messageId: id.toString(),
    userId: receiverId,
  });

  const message = await messageService.getMessageById(id.toString());

  getIO().to(`user:${message.sender_id}`).emit(SOCKET_EVENTS.MESSAGE_SEEN, {
    messageId: id.toString(),
    userId: receiverId,
    seenAt: receipt.seen_at,
  });

  return res.status(200).json(receipt);
});

// Get all receipts for a message
const getReceipts = asyncHandler(async (req, res) => {
  const { id } = req.params; // messageId
  const result = await receiptsService.getReceipts(id.toString());
  return res.status(200).json(result);
});

// Get all users who have seen a message
const getSeenUsers = asyncHandler(async (req, res) => {
  const { id } = req.params; // messageId
  const result = await receiptsService.getSeenUsers(id.toString());
  return res.status(200).json(result);
});

// Get all users who have received (delivered) a message
const getDeliveredUsers = asyncHandler(async (req, res) => {
  const { id } = req.params; // messageId
  const result = await receiptsService.getDeliveredUsers(id.toString());
  return res.status(200).json(result);
});

export const receiptsController = {
  createReceipt,
  markDelivered,
  markSeen,
  getReceipts,
  getSeenUsers,
  getDeliveredUsers,
};
