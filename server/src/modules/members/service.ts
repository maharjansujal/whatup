import { db } from "../../shared/db";
import { createAppError } from "../../shared/errors/appError";
import { memberRepository } from "./repository";
import { ChatMember, CreateMemberInput } from "./types";

const createMember = ({
  conversationId,
  userId,
  role = "member",
}: CreateMemberInput) => {
  return memberRepository.createMember({
    conversationId,
    userId,
    role,
  });
};

const deleteMember = ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) => {
  return memberRepository.deleteMember({
    conversationId,
    userId,
  });
};

const getAllMembers = (conversationId: string): Promise<ChatMember[]> => {
  return memberRepository.getAllMembers(conversationId);
};

const getMemberById = ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}): Promise<ChatMember> => {
  return memberRepository.getMemberById({
    conversationId,
    userId,
  });
};

const promoteUser = async ({
  conversationId,
  userId,
  requestingUserId,
}: {
  conversationId: string;
  userId: string;
  requestingUserId: string;
}) => {
  const requester = await memberRepository.getMemberById({
    conversationId,
    userId: requestingUserId,
  });
  if (requester.role !== "owner") {
    throw createAppError("You are not allowed to promote a member", 403);
  }
  return memberRepository.promoteMember({ conversationId, userId });
};

const demoteUser = async ({
  conversationId,
  userId,
  requestingUserId,
}: {
  conversationId: string;
  userId: string;
  requestingUserId: string;
}) => {
  const requester = await memberRepository.getMemberById({
    conversationId,
    userId: requestingUserId,
  });
  if (requester.role !== "owner") {
    throw createAppError("You are not allowed to demote a member", 403);
  }
  return memberRepository.demoteMember({ conversationId, userId });
};

const updateLastRead = ({
  lastReadMessageId,
  conversationId,
  userId,
}: {
  lastReadMessageId: string;
  conversationId: string;
  userId: string;
}) => {
  return memberRepository.updateLastRead({
    lastReadMessageId,
    conversationId,
    userId,
  });
};

const updateNickname = ({
  conversation_id,
  nickname,
  user_id,
}: {
  conversation_id: string;
  nickname: string;
  user_id: string;
}) => {
  return memberRepository.updateNickname({
    conversation_id,
    nickname,
    user_id,
  });
};

const muteConversation = ({
  conversation_id,
  user_id,
  muted_until,
}: {
  conversation_id: string;
  user_id: string;
  muted_until: string;
}) => {
  return memberRepository.muteConversation({
    conversation_id,
    user_id,
    muted_until,
  });
};

const archiveConversation = ({
  conversation_id,
  user_id,
}: {
  conversation_id: string;
  user_id: string;
}) => {
  return memberRepository.archiveConversation({
    conversation_id,
    user_id,
  });
};

const unarchiveConversation = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  return memberRepository.unarchiveConversation({ id, userId });
};

export const unmuteConversation = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  return memberRepository.unmuteConversation({ id, userId });
};

const listArchivedChats = (userId: string) => {
  return memberRepository.listArchivedChats(userId);
};

const listMuted = (userId: string) => {
  return memberRepository.listMuted(userId);
};

const getUserConversationIds = (userId: string) => {
  return memberRepository.getUserConversationIds(userId);
};

const countArchived = (userId: string) => {
  return memberRepository.countArchived(userId);
};

const countMuted = (userId: string) => {
  return memberRepository.countMuted(userId);
};

const countMembers = (conversationId: string) => {
  return memberRepository.countMembers(conversationId);
};

const getMemberIds = (conversationId: string) => {
  return memberRepository.getMemberIds(conversationId);
};

const leaveGroup = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) => {
  const executor = await db.connect();
  try {
    await executor.query("BEGIN");

    const member = await memberRepository.getMemberById(
      {
        conversationId,
        userId,
      },
      executor,
    );

    if (!member) {
      throw createAppError("You are not a member of this conversation", 404);
    }

    if (member.role === "owner") {
      throw createAppError(
        "You need to transfer ownership before leaving the group",
        403,
      );
    }

    const deleted = await memberRepository.deleteMember(
      {
        conversationId,
        userId,
      },
      executor,
    );

    await executor.query("COMMIT");
    return deleted;
  } catch (err) {
    await executor.query("ROLLBACK");
    throw err;
  } finally {
    executor.release();
  }
};

export const memberService = {
  createMember,
  deleteMember,
  getAllMembers,
  getMemberById,
  promoteUser,
  demoteUser,
  updateLastRead,
  updateNickname,
  muteConversation,
  unmuteConversation,
  archiveConversation,
  unarchiveConversation,
  listArchivedChats,
  listMuted,
  getUserConversationIds,
  countArchived,
  countMuted,
  countMembers,
  getMemberIds,
  leaveGroup,
};
