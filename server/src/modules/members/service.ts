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

const promoteUser = ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) => {
  return memberRepository.promoteMember({
    conversationId,
    userId,
  });
};

const demoteUser = ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) => {
  return memberRepository.demoteMember({
    conversationId,
    userId,
  });
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
}: {
  conversation_id: string;
  user_id: string;
}) => {
  return memberRepository.muteConversation({
    conversation_id,
    user_id,
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

  listArchivedChats,
  listMuted,
  getUserConversationIds,
  countArchived,
  countMuted,
  countMembers,
  getMemberIds,
};
