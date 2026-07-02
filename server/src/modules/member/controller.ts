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
  const { conversationId, userId } = req.params;
  const requestingUserId = req.user.id;

  const requestingUser = await memberService.getMemberById({
    conversationId: conversationId.toString(),
    userId: requestingUserId,
  });

  if (requestingUser.role === "member") {
    throw createAppError("You are not allowed to kick out a member", 403);
  }
  const result = await memberService.deleteMember({
    conversationId: conversationId.toString(),
    userId: userId.toString(),
  });
  return res.status(200).json(result);
});

const getAllMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = memberService.getAllMembers(id.toString());
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
  });
  return res.status(200).json(result);
});

const demoteUser = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const result = await memberService.demoteUser({
    conversationId: id.toString(),
    userId: userId.toString(),
  });
  return res.status(200).json(result);
});

const updateLastRead = asyncHandler(async (req, res) => {
  const result = await memberService.updateLastRead({
    lastReadMessageId,
    conversationId,
    userId,
  });
  return res.status(200).json(result);
});

export const memberController = {
  createMember,
  deleteMember,

  getAllMembers,
  getMemberById,

  promoteUser,
  demoteUser,
};
