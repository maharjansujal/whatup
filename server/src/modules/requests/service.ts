import { createAppError } from "../../shared/errors/appError";
import { requestsRepository } from "./repository";
import { ConversationRequest } from "./types";

// Create a new request
const createRequest = async (data: {
  conversationId: string;
  requestorId: string;
  recipientId: string;
}): Promise<ConversationRequest> => {
  if (!data.conversationId || !data.requestorId || !data.recipientId) {
    throw createAppError(
      "conversationId, requestorId, and recipientId are required",
      400,
    );
  }

  // Prevent duplicate pending requests
  const existing = await requestsRepository.findPending(
    data.requestorId,
    data.recipientId,
  );
  if (existing) {
    throw createAppError("A pending request already exists", 409);
  }

  return requestsRepository.createRequest(data);
};

// Find pending request
const findPending = async (
  requestorId: string,
  recipientId: string,
): Promise<ConversationRequest | null> => {
  if (!requestorId || !recipientId) {
    throw createAppError("requestorId and recipientId are required", 400);
  }
  return requestsRepository.findPending(requestorId, recipientId);
};

// Find by ID
const findById = async (id: string): Promise<ConversationRequest | null> => {
  if (!id) throw createAppError("id is required", 400);
  return requestsRepository.findById(id);
};

// Accept request
const accept = async (id: string): Promise<ConversationRequest | null> => {
  const request = await requestsRepository.findById(id);
  if (!request) throw createAppError("Request not found", 404);
  if (request.status !== "pending")
    throw createAppError("Only pending requests can be accepted", 400);

  return requestsRepository.accept(id);
};

// Decline request
const decline = async (id: string): Promise<ConversationRequest | null> => {
  const request = await requestsRepository.findById(id);
  if (!request) throw createAppError("Request not found", 404);
  if (request.status !== "pending")
    throw createAppError("Only pending requests can be declined", 400);

  return requestsRepository.decline(id);
};

// Cancel request
const cancel = async (id: string): Promise<ConversationRequest | null> => {
  const request = await requestsRepository.findById(id);
  if (!request) throw createAppError("Request not found", 404);
  if (request.status !== "pending")
    throw createAppError("Only pending requests can be cancelled", 400);

  return requestsRepository.cancel(id);
};

// List incoming requests
const listIncoming = async (userId: string): Promise<ConversationRequest[]> => {
  if (!userId) throw createAppError("userId is required", 400);
  return requestsRepository.listIncoming(userId);
};

// List outgoing requests
const listOutgoing = async (userId: string): Promise<ConversationRequest[]> => {
  if (!userId) throw createAppError("userId is required", 400);
  return requestsRepository.listOutgoing(userId);
};

export const requestsService = {
  createRequest,
  findPending,
  findById,
  accept,
  decline,
  cancel,
  listIncoming,
  listOutgoing,
};
