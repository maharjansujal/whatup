import { asyncHandler } from "../../shared/utils/asyncHandler";
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
  const result = await receiptsService.markDelivered({
    messageId: id.toString(),
    userId: req.user.id,
  });
  return res.status(200).json(result);
});

// Mark seen
const markSeen = asyncHandler(async (req, res) => {
  const { id } = req.params; // messageId
  const result = await receiptsService.markSeen({
    messageId: id.toString(),
    userId: req.user.id,
  });
  return res.status(200).json(result);
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
