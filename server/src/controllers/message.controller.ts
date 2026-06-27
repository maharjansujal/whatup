import { Request, Response } from "express";
import {
  createMessageService,
  deleteMessageService,
  getAllMessagesService,
  getConversationMessagesService,
  updateMessageService,
} from "../services/message.service";
import { getReceiverSocketId } from "../socket/socket";
import { io } from "../../index";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.body;
    const result = await getAllMessagesService(receiverId);
    return res
      .status(200)
      .json({ message: "Messages retrieved successfully", ...result });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};

export const getConversationMessages = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const senderId = req.user?.id;
    const receiverId = Number(req.query.receiverId);

    if (!senderId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    if (isNaN(senderId) || isNaN(receiverId)) {
      return res.status(400).json({
        message: "senderId and receiverId must be valid numbers",
      });
    }

    const result = await getConversationMessagesService(senderId, receiverId);

    return res.status(200).json({
      message: "Messages retrieved successfully",
      messages: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};
export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user?.id;
    if (!senderId) {
      return res.status(401).json({ message: "User not logged in" });
    }
    const result = await createMessageService(receiverId, senderId, content);

    const receiverSocketId = getReceiverSocketId(Number(receiverId));
    const senderSocketId = getReceiverSocketId(Number(senderId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", result);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", result);
    }

    return res.status(201).json({ message: "Message sent!", ...result });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};

export const updateMessage = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const messageId = Number(req.params.messageId);
    const { content, receiverId } = req.body;
    if (isNaN(messageId)) {
      return res.status(400).json({
        message: "Invalid message id",
      });
    }
    const result = await updateMessageService(messageId, content);

    if (!result) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (receiverId) {
      const receiverSocketId = getReceiverSocketId(Number(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageUpdated", result);
      }
    }
    return res.status(200).json({
      message: "Message updated successfully",
      messageData: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};

export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const messageId = Number(req.params.messageId);
    if (isNaN(messageId)) {
      return res.status(400).json({
        message: "Invalid message id",
      });
    }
    const deleted = await deleteMessageService(messageId);
    if (!deleted) {
      return res.status(404).json({
        message: "Message not found",
      });
    }
    return res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};
