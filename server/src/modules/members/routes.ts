import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { memberController } from "./controller";

const router = Router();

router.use(requireAuth);

// Member management
router.post("/:id/members", memberController.createMember);
router.delete("/:id/members/:userId", memberController.deleteMember);

// Member queries
router.get("/:id/members", memberController.getAllMembers);
router.get("/:id/members/:userId", memberController.getMemberById);

// Role management
router.patch("/:id/members/:userId/promote", memberController.promoteUser);
router.patch("/:id/members/:userId/demote", memberController.demoteUser);

// Personal member settings
router.patch("/:id/members/me/last-read", memberController.updateLastRead);
router.patch("/:id/members/me/nickname", memberController.updateNickname);
router.patch("/:id/members/me/mute", memberController.muteConversation);
router.patch("/:id/members/me/archive", memberController.archiveConversation);

export default router;
