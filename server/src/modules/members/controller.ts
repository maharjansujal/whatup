import { createAppError } from "../../shared/errors/appError";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { memberService } from "./service";

const createMember = asyncHandler(async (req, res) => {
  const { memberId, role } = req.body;
  const conversationId = req.params.id;
  const requestingUser = await memberService.getMemberById({
    conversationId: conversationId.toString(),
    userId: req.user.id,
  });
  if (requestingUser.role === "member") {
    throw createAppError("You are not allowed to add a new member", 403);
  }
  const member = await memberService.createMember({
    userId: memberId,
    conversationId: conversationId.toString(),
    role,
  });
  return res.status(200).json(member);
});

const deleteMember = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const requestingUserId = req.user.id;

  const requestingUser = await memberService.getMemberById({
    conversationId: id.toString(),
    userId: requestingUserId,
  });

  if (requestingUser.role === "member") {
    throw createAppError("You are not allowed to kick out a member", 403);
  }
  const result = await memberService.deleteMember({
    conversationId: id.toString(),
    userId: userId.toString(),
  });
  return res.status(200).json(result);
});

const getAllMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await memberService.getAllMembers(id.toString());
  return res.status(200).json(result);
});

const getMemberById = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const result = await memberService.getMemberById({
    conversationId: id.toString(),
    userId: userId.toString(),
  });
  return res.status(200).json(result);
});

const promoteUser = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const result = await memberService.promoteUser({
    conversationId: id.toString(),
    userId: userId.toString(),
    requestingUserId: req.user.id,
  });
  return res.status(200).json(result);
});

const demoteUser = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const result = await memberService.demoteUser({
    conversationId: id.toString(),
    userId: userId.toString(),
    requestingUserId: req.user.id,
  });
  return res.status(200).json(result);
});

const updateLastRead = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const { lastReadMessageId } = req.body;
  const userId = req.user.id;

  const result = await memberService.updateLastRead({
    conversationId: conversationId.toString(),
    userId,
    lastReadMessageId,
  });
  return res.status(200).json(result);
});

const updateNickname = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nickname } = req.body;
  const result = await memberService.updateNickname({
    conversation_id: id.toString(),
    nickname,
    user_id: req.user.id,
  });
  return res.status(200).json(result);
});

const muteConversation = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { muted_until } = req.body;
  const result = await memberService.muteConversation({
    conversation_id: id.toString(),
    user_id: req.user.id,
    muted_until,
  });
  return res.status(200).json(result);
});

const archiveConversation = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const result = await memberService.archiveConversation({
    conversation_id: id.toString(),
    user_id: req.user.id,
  });
  return res.status(200).json(result);
});

const countMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await memberService.countMembers(id.toString());
  return res.status(200).json({ count: result });
});

const getMemberIds = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await memberService.getMemberIds(id.toString());
  return res.status(200).json(result);
});

const getUserConversationIds = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await memberService.getUserConversationIds(userId.toString());
  return res.status(200).json(result);
});

const listArchivedChats = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const result = await memberService.listArchivedChats(id.toString());
  return res.status(200).json(result);
});

const listMuted = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await memberService.listMuted(userId.toString());
  return res.status(200).json(result);
});

const countArchived = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await memberService.countArchived(userId.toString());
  return res.status(200).json({ count: result });
});

const countMuted = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await memberService.countMuted(userId.toString());
  return res.status(200).json({ count: result });
});

export const memberController = {
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

  countMembers,
  getMemberIds,
  getUserConversationIds,
  listArchivedChats,
  listMuted,
  countArchived,
  countMuted,
};
