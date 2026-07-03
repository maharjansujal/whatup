import { createAppError } from "../../shared/errors/appError";
import { inviteRepository } from "./repository";
import { Invite } from "./types";

const createInvite = async ({
  conversationId,
  createdByUserId,
  code,
  maxUses,
  expiresAt,
}: {
  conversationId: string;
  createdByUserId: string;
  code: string;
  maxUses?: number;
  expiresAt?: Date;
}): Promise<Invite> => {
  return inviteRepository.createInvite({
    conversationId,
    createdByUserId,
    code,
    maxUses,
    expiresAt,
  });
};

const findByCode = async (code: string): Promise<Invite | null> => {
  return inviteRepository.findByCode(code);
};

const isValid = async (code: string): Promise<boolean> => {
  return inviteRepository.isValid(code);
};

const consumeInvite = async (code: string): Promise<Invite> => {
  const invite = await inviteRepository.findByCode(code);
  if (!invite) {
    throw createAppError("Invite not found", 404);
  }
  if (!(await inviteRepository.isValid(code))) {
    throw createAppError("Invite is invalid or expired", 400);
  }
  return inviteRepository.incrementUsage(invite.id);
};

const deactivate = async (inviteId: string): Promise<Invite> => {
  return inviteRepository.deactivate(inviteId);
};

const deleteInvite = async (inviteId: string): Promise<void> => {
  return inviteRepository.deleteInvite(inviteId);
};

const listConversation = async (conversationId: string): Promise<Invite[]> => {
  return inviteRepository.listConversation(conversationId);
};

export const inviteService = {
  createInvite,
  findByCode,
  isValid,
  consumeInvite,
  incrementUsage: inviteRepository.incrementUsage,
  deactivate,
  deleteInvite,
  listConversation,
};
