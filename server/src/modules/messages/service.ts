import { messagesRepository } from "./repository";

const getConversationMessages = async (userId: string) => {
  return await messagesRepository.getConversationMessages(userId);
};

export const messageService = {
  getConversationMessages,
};
