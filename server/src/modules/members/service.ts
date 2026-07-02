import { memberRepository } from "./repository";
import { createAppError } from "../../shared/errors/appError";
import { ChatMember, CreateMemberInput } from "./types";

const createMember = async ({
  conversationId,
  userId,
  role = "member",
}: CreateMemberInput) => {
  const isMember = await memberRepository.isMember({ conversationId, userId });
  if (isMember) {
    throw createAppError("Member already exists", 409);
  }
  const member = await memberRepository.createMember({
    conversationId,
    userId,
    role,
  });
  return member;
};

const deleteMember = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) => {
  const result = await memberRepository.deleteMember({
    conversationId,
    userId,
  });
  if (!result) {
    throw createAppError("This user is not a member of this conversation", 404);
  }
  return result;
};

const getAllMembers = async (conversationId: string): Promise<ChatMember[]> => {
  const result = await memberRepository.getAllMembers(conversationId);
  return result;
};

const getMemberById = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}): Promise<ChatMember> => {
  const result = await memberRepository.getMemberById({
    conversationId,
    userId,
  });
  return result;
};

const promoteUser = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) => {
  const result = await memberRepository.promoteMember({
    conversationId,
    userId,
  });
  return result;
};

const demoteUser = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) => {
  const result = await memberRepository.demoteMember({
    conversationId,
    userId,
  });
  return result;
};

const updateLastRead = async ({
  lastReadMessageId,
  conversationId,
  userId,
}: {
  lastReadMessageId: string;
  conversationId: string;
  userId: string;
}) => {
  const result = await memberRepository.updateLastRead({
    lastReadMessageId,
    conversationId,
    userId,
  });
  return result;
};

const updateNickname = async ({
  conversation_id,
  nickname,
  user_id,
}: {
  conversation_id: string;
  nickname: string;
  user_id: string;
}) => {
  const result = await memberRepository.updateNickname({
    conversation_id,
    nickname,
    user_id,
  });
  return result;
};

const muteConversation = async ({
  conversation_id,
  user_id,
}: {
  conversation_id: string;
  user_id: string;
}) => {
  const result = await memberRepository.muteConversation({
    conversation_id,
    user_id,
  });
  return result;
};

const archiveConversation = async ({
  conversation_id,
  user_id,
}: {
  conversation_id: string;
  user_id: string;
}) => {
  const result = await memberRepository.archiveConversation({
    conversation_id,
    user_id,
  });
  return result;
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
  archiveConversation,
};
