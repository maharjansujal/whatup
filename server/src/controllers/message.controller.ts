import { Request, Response } from "express";
import {
  createMessageService,
  getConversationMessagesService,
} from "../services/message.service";

export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const result = await getConversationMessagesService(senderId, receiverId);
    return res
      .status(200)
      .json({ message: "Messages retrieved successfully", ...result });
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
    return res.status(201).json({ message: "Message sent!", ...result });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};
