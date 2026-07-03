import { Router } from "express";
import { inviteController } from "./controller";

const router = Router();

router.post("/:id/invites", inviteController.createInvite);
router.get("/:id/invites", inviteController.listConversationInvites);

router.get("/invites/:code", inviteController.findByCode);
router.get("/invites/:code/validate", inviteController.validateInvite);
router.post("/invites/:code/consume", inviteController.consumeInvite);
router.patch(
  "/invites/:inviteId/deactivate",
  inviteController.deactivateInvite,
);
router.delete("/invites/:inviteId", inviteController.deleteInvite);

export default Router;
