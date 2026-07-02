import { createAppError } from "../../shared/errors/appError";
import { userRepository } from "../users/repository";
import { conversationRepository } from "./repository";
import { ConversationUpdateInput } from "./types";

const createDirectConversation = async ({
  currentUserId,
  otherUserId,
}: {
  currentUserId: string;
  otherUserId: string;
}) => {
  const otherUser = await userRepository.getUserById(otherUserId);

  if (!otherUser) {
    throw createAppError("User not found", 404);
  }
  if (currentUserId === otherUserId) {
    throw createAppError("You cannot start a conversation with yourself", 400);
  }
  const existing = await conversationRepository.findDirectConversation(
    currentUserId,
    otherUserId,
  );
  if (existing) return existing;

  const conversation = await conversationRepository.create({
    type: "direct",
    createdByUserId: currentUserId,
  });

  await conversationRepository.createMember({
    conversationId: conversation.id,
    userId: currentUserId,
  });

  await conversationRepository.createMember({
    conversationId: conversation.id,
    userId: otherUserId,
  });

  return conversation;
};

const createGroupConversation = async ({
  currentUserId,
  otherUserIds,
}: {
  currentUserId: string;
  otherUserIds: string[];
}) => {
  const otherUsers: string[] = [];

  for (const id of otherUserIds) {
    const user = await userRepository.getUserById(id);

    if (!user) {
      throw createAppError(`User ${id} not found`, 404);
    }

    otherUsers.push(user.id);
  }
  if (otherUsers.length === 0) {
    throw createAppError("No user to add", 401);
  }
  const conversation = await conversationRepository.create({
    type: "group",
    createdByUserId: currentUserId,
  });
  await conversationRepository.createMember({
    userId: currentUserId,
    conversationId: conversation.id,
  });
  for (let i = 0; i < otherUsers.length; i++) {
    await conversationRepository.createMember({
      userId: otherUsers[i],
      conversationId: conversation.id,
    });
  }
  return conversation;
};

const updateConversation = async ({
  id,
  updates,
  userId,
}: {
  id: string;
  updates: ConversationUpdateInput;
  userId: string;
}) => {
  const conversation = await conversationRepository.findById(id);
  if (!conversation) {
    throw createAppError("Conversation does not exist", 404);
  }
  if (conversation.type === "direct") {
    throw createAppError("Direct conversations cannot be updated", 400);
  }

  if (conversation.created_by_user_id !== userId) {
    throw createAppError("You are not allowed to edit this conversation", 403);
  }
  const result = await conversationRepository.updateConversation({
    id,
    updates,
  });
  return result;
};

const deleteConversation = async (id: string) => {
  const conversation = await conversationRepository.findById(id);
  if (!conversation) {
    throw createAppError("Conversation does not exist", 404);
  }
  const result = await conversationRepository.deleteConversation(id);
  return result;
};

export const conversationService = {
  createDirectConversation,
  createGroupConversation,
  updateConversation,
  deleteConversation,
};
