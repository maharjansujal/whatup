import { asyncHandler } from "../../shared/utils/asyncHandler";
import { inviteService } from "./service";

const createInvite = asyncHandler(async (req, res) => {
  const { id } = req.params; // conversationId
  const { code, maxUses, expiresAt } = req.body;
  const result = await inviteService.createInvite({
    conversationId: id.toString(),
    createdByUserId: req.user.id,
    code,
    maxUses,
    expiresAt,
  });
  return res.status(201).json(result);
});

const findByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const result = await inviteService.findByCode(code.toString());
  if (!result) {
    return res.status(404).json({ message: "Invite not found" });
  }
  return res.status(200).json(result);
});

const validateInvite = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const valid = await inviteService.isValid(code.toString());
  return res.status(200).json({ valid });
});

const consumeInvite = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const result = await inviteService.consumeInvite(code.toString());
  return res.status(200).json(result);
});

const deactivateInvite = asyncHandler(async (req, res) => {
  const { inviteId } = req.params;
  const result = await inviteService.deactivate(inviteId.toString());
  return res.status(200).json(result);
});

// Delete invite
const deleteInvite = asyncHandler(async (req, res) => {
  const { inviteId } = req.params;
  await inviteService.deleteInvite(inviteId.toString());
  return res.status(204).send();
});

const listConversationInvites = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await inviteService.listConversation(id.toString());
  return res.status(200).json(result);
});

export const inviteController = {
  createInvite,
  findByCode,
  validateInvite,
  consumeInvite,
  deactivateInvite,
  deleteInvite,
  listConversationInvites,
};
