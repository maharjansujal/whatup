import { Router } from "express";
import {
  createMessage,
  getConversationMessages,
} from "../controllers/message.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createMessage);
router.get("/", authMiddleware, getConversationMessages);

export default router;
