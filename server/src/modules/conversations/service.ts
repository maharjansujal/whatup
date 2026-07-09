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
  const otherUser = await userRepository.findById(otherUserId);

  if (!otherUser) {
    throw createAppError("User not found", 404);
  }
  if (currentUserId === otherUserId) {
    throw createAppError("You cannot start a conversation with yourself", 400);
  }

  const existing = await conversationRepository.findDirectConversation({
    userId1: currentUserId,
    userId2: otherUserId,
  });
  if (existing) {
    const senderConversation =
      await conversationRepository.findConversationForUser({
        conversationId: existing.id,
        userId: currentUserId,
      });

    const receiverConversation =
      await conversationRepository.findConversationForUser({
        conversationId: existing.id,
        userId: otherUserId,
      });

    return {
      senderConversation,
      receiverConversation,
      memberIds: [currentUserId, otherUserId],
    };
  }

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

    const senderConversation =
      await conversationRepository.findConversationForUser({
        conversationId: conversation.id,
        userId: currentUserId,
      });

    const receiverConversation =
      await conversationRepository.findConversationForUser({
        conversationId: conversation.id,
        userId: otherUserId,
      });

    return {
      senderConversation,
      receiverConversation,
      memberIds: [currentUserId, otherUserId],
    };
  } catch (error) {
    await txClient.query("ROLLBACK");
    throw error;
  } finally {
    txClient.release();
  }
};

const createGroupConversation = async ({
  groupName,
  currentUserId,
  otherUserIds,
}: {
  groupName: string;
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
        name: groupName,
      },
      txClient,
    );

    await conversationRepository.createMember(
      {
        userId: currentUserId,
        conversationId: conversation.id,
        role: "owner",
      },
      txClient,
    );

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
    const memberIds = [currentUserId, ...otherUserIds];
    const hydratedConversations = await Promise.all(
      [currentUserId, ...otherUserIds].map(async (userId) => ({
        userId,
        conversation: await conversationRepository.findConversationForUser({
          conversationId: conversation.id,
          userId,
        }),
      })),
    );

    return {
      senderConversation: hydratedConversations.find(
        (c) => c.userId === currentUserId,
      )!.conversation,

      receiverConversations: hydratedConversations.filter(
        (c) => c.userId !== currentUserId,
      ),
      memberIds,
    };
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
  const result = await conversationRepository.deleteConversation({ id });
  return result;
};

const getConversationById = async (id: string) => {
  const conversation = await conversationRepository.findById(id);
  if (!conversation) {
    throw createAppError("Conversation does not exist", 404);
  }
  return conversation;
};

const listUserConversations = async (userId: string) => {
  return conversationRepository.findUserConversations({ userId });
};

export const conversationService = {
  createDirectConversation,
  createGroupConversation,
  updateConversation,
  deleteConversation,
  getConversationById,
  listUserConversations,
};
