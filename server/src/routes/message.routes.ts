import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getConversationMessages,
  updateMessage,
} from "../controllers/message.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createMessage);
router.get("/", authMiddleware, getConversationMessages);

router.patch("/:messageId", authMiddleware, updateMessage);
router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;
