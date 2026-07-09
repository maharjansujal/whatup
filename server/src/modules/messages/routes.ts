import { Router } from "express";
import { messageController } from "./controller";
import { upload } from "../../shared/cloudinary/multer";

const router = Router();

router.post(
  "/:id/messages",
  upload.array("files", 10),
  messageController.createMessage,
);
router.get("/messages/:messageId", messageController.getMessageById);
router.patch("/messages/:messageId", messageController.updateMessageContent);
router.delete("/messages/:messageId", messageController.deleteMessage);

router.get("/:id/messages", messageController.getConversationMessages);
router.get("/:id/messages/search", messageController.searchMessages);

router.get(
  "/messages/:messageId/attachments",
  messageController.getAttachments,
);
router.delete(
  "/messages/:messageId/attachments",
  messageController.deleteAttachments,
);

export default router;
