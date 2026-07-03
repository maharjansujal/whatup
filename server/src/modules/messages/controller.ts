import { asyncHandler } from "../../shared/utils/asyncHandler";
import { messageService } from "./service";

const createMessage = asyncHandler(async (req, res) => {
  const { id } = req.params; // conversationId
  const { type, content, replyToMessageId } = req.body;
  const result = await messageService.createMessage({
    conversationId: id.toString(),
    senderId: req.user.id,
    type,
    content,
    replyToMessageId,
  });
  return res.status(201).json(result);
});

const getMessageById = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const result = await messageService.getMessageById(messageId.toString());
  return res.status(200).json(result);
});

const updateMessageContent = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const result = await messageService.updateMessageContent({
    messageId: messageId.toString(),
    content,
  });
  return res.status(200).json(result);
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const result = await messageService.deleteMessage(messageId.toString());
  return res.status(200).json(result);
});

const getConversationMessages = asyncHandler(async (req, res) => {
  const { id } = req.params; // conversationId
  const { cursor, limit } = req.query;
  const result = await messageService.getConversationMessages(
    id.toString(),
    cursor ? new Date(cursor.toString()) : null,
    limit ? parseInt(limit.toString(), 10) : 20,
  );
  return res.status(200).json(result);
});

const getLastMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await messageService.getLastMessage(id.toString());
  return res.status(200).json(result);
});

const countMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await messageService.countMessages(id.toString());
  return res.status(200).json({ count: result });
});

const searchMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { keyword } = req.query;
  const result = await messageService.searchMessages(
    id.toString(),
    keyword?.toString() || "",
  );
  return res.status(200).json(result);
});

const findReplyMessages = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const result = await messageService.findReplyMessages(messageId.toString());
  return res.status(200).json(result);
});

const addAttachments = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const attachments = req.body;
  const result = await messageService.addAttachments(
    attachments.map((a: any) => ({ ...a, messageId })),
  );
  return res.status(201).json(result);
});

const getAttachments = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const result = await messageService.getAttachments(messageId.toString());
  return res.status(200).json(result);
});

const deleteAttachments = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const result = await messageService.deleteAttachments(messageId.toString());
  return res.status(200).json(result);
});

export const messageController = {
  createMessage,
  getMessageById,
  updateMessageContent,
  deleteMessage,
  getConversationMessages,
  getLastMessage,
  countMessages,
  searchMessages,
  findReplyMessages,
  addAttachments,
  getAttachments,
  deleteAttachments,
};
