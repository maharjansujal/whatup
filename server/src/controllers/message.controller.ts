import { Request, Response } from "express";
import {
  createMessageService,
  getAllMessagesService,
  getConversationMessagesService,
} from "../services/message.service";
import { getReceiverSocketId } from "../socket/socket";
import { io } from "../../index";

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

export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const senderId = Number(req.query.senderId);
    const receiverId = Number(req.query.receiverId);

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
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, senderId, content } = req.body;
    const result = await createMessageService(receiverId, senderId, content);

    const receiverSocketId = getReceiverSocketId(Number(receiverId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", result);
    }
    return res.status(201).json({ message: "Message sent!", ...result });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};
