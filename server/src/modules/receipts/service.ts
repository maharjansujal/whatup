import { createAppError } from "../../shared/errors/appError";
import { receiptsRepository } from "./repository";
import { Receipt } from "./types";

// Create a receipt entry when a message is sent
const createReceipt = async ({
  messageId,
  userId,
}: {
  messageId: string;
  userId: string;
}): Promise<Receipt> => {
  if (!messageId || !userId) {
    throw createAppError("messageId and userId are required", 400);
  }
  return receiptsRepository.createReceipt({ messageId, userId });
};

// Mark a message as delivered for a user
const markDelivered = async ({
  messageId,
  userId,
}: {
  messageId: string;
  userId: string;
}): Promise<Receipt> => {
  if (!messageId || !userId) {
    throw createAppError("messageId and userId are required", 400);
  }
  return receiptsRepository.markDelivered(messageId, userId);
};

const markAllDelivered = async (userId: string) => {
  return receiptsRepository.markAllDelivered({ userId });
};

// Mark a message as seen for a user
const markSeen = async ({
  messageId,
  userId,
}: {
  messageId: string;
  userId: string;
}): Promise<Receipt> => {
  if (!messageId || !userId) {
    throw createAppError("messageId and userId are required", 400);
  }
  return receiptsRepository.markSeen(messageId, userId);
};

// Get all receipts for a message
const getReceipts = async (messageId: string): Promise<Receipt[]> => {
  if (!messageId) {
    throw createAppError("messageId is required", 400);
  }
  return receiptsRepository.getReceipts(messageId);
};

// Get all users who have seen a message
const getSeenUsers = async (
  messageId: string,
): Promise<{ user_id: string; seen_at: Date }[]> => {
  if (!messageId) {
    throw createAppError("messageId is required", 400);
  }
  return receiptsRepository.getSeenUsers(messageId);
};

// Get all users who have received (delivered) a message
const getDeliveredUsers = async (
  messageId: string,
): Promise<{ user_id: string; delivered_at: Date }[]> => {
  if (!messageId) {
    throw createAppError("messageId is required", 400);
  }
  return receiptsRepository.getDeliveredUsers(messageId);
};

export const receiptsService = {
  createReceipt,
  markDelivered,
  markSeen,
  getReceipts,
  getSeenUsers,
  getDeliveredUsers,
  markAllDelivered,
};
