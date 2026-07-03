import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { conversationController } from "./controller";

const router = Router();

router.get("/:id", requireAuth, conversationController.getConversationById);
router.get("/", requireAuth, conversationController.listUserConversations);
router.get("/:id/exists", requireAuth, conversationController.exists);
router.get("/:id/is-group", requireAuth, conversationController.isGroup);
router.get("/:id/creator", requireAuth, conversationController.getCreator);
router.post("/direct", requireAuth, conversationController.createConversation);
router.post(
  "/group",
  requireAuth,
  conversationController.createGroupConversation,
);
router.patch("/:id", requireAuth, conversationController.updateConversation);
router.patch(
  "/:id/last-message",
  requireAuth,
  conversationController.updateLastMessage,
);
router.delete("/:id", requireAuth, conversationController.deleteConversation);

export default router;
