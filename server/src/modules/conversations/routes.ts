import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { conversationController } from "./controller";

const router = Router();

router.post("/direct", requireAuth, conversationController.createConversation);
router.patch("/:id", requireAuth, conversationController.updateConversation);
router.delete("/:id", requireAuth, conversationController.deleteConversation);

export default router;
