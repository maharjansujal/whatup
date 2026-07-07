import { Router } from "express";
import { messageController } from "./controller";

const router = Router();

router.post("/:id/messages", messageController.createMessage);
router.get("/messages/:messageId", messageController.getMessageById);
router.patch("/messages/:messageId", messageController.updateMessageContent);
router.delete("/messages/:messageId", messageController.deleteMessage);

router.get("/:id/messages", messageController.getConversationMessages);
router.get("/:id/messages/search", messageController.searchMessages);

router.post(
  "/messages/:messageId/attachments",
  messageController.addAttachments,
);
router.get(
  "/messages/:messageId/attachments",
  messageController.getAttachments,
);
router.delete(
  "/messages/:messageId/attachments",
  messageController.deleteAttachments,
);

export default router;
