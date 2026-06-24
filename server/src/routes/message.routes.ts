import { Router } from "express";
import {
  createMessage,
  getConversationMessages,
} from "../controllers/message.controller";

const router = Router();

router.post("/", createMessage);
router.get("/", getConversationMessages);

export default router;
