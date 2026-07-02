import { db } from "../../shared/db";
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

  // Initialize Connection Client for the Transaction Block
  const txClient = await db.connect();

  try {
    await txClient.query("BEGIN");

    const conversation = await conversationRepository.create(
      {
        type: "direct",
        createdByUserId: currentUserId,
      },
      txClient,
    );

    await conversationRepository.createMember(
      {
        conversationId: conversation.id,
        userId: currentUserId,
      },
      txClient,
    );

    await conversationRepository.createMember(
      {
        conversationId: conversation.id,
        userId: otherUserId,
      },
      txClient,
    );

    await txClient.query("COMMIT");
    return conversation;
  } catch (error) {
    await txClient.query("ROLLBACK");
    throw error;
  } finally {
    txClient.release(); // Releases pool connection back safely
  }
};

const createGroupConversation = async ({
  currentUserId,
  otherUserIds,
}: {
  currentUserId: string;
  otherUserIds: string[];
}) => {
  if (!otherUserIds || otherUserIds.length === 0) {
    throw createAppError(
      "Group conversations require at least one other member",
      400,
    );
  }
  const txClient = await db.connect();
  try {
    await txClient.query("BEGIN");
    const conversation = await conversationRepository.create(
      {
        type: "group",
        createdByUserId: currentUserId,
        name: "New Group Chat", // You can pass dynamic metadata fields as needed
      },
      txClient,
    );

    // Add owner / creator member
    await conversationRepository.createMember(
      {
        userId: currentUserId,
        conversationId: conversation.id,
        role: "owner",
      },
      txClient,
    );

    // Add each invitee
    for (const userId of otherUserIds) {
      await conversationRepository.createMember(
        {
          userId,
          conversationId: conversation.id,
          role: "member",
        },
        txClient,
      );
    }

    await txClient.query("COMMIT");
    return conversation;
  } catch (error) {
    await txClient.query("ROLLBACK");
    throw error;
  } finally {
    txClient.release();
  }
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
