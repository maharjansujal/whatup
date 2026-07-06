import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { memberController } from "./controller";

const router = Router();

router.use(requireAuth);

router.post("/:id/members", memberController.createMember);
router.delete("/:id/members/:userId", memberController.deleteMember);

router.get("/:id/members", memberController.getAllMembers);
router.get("/:id/members/:userId", memberController.getMemberById);
router.get("/members/archived-chats", memberController.listArchivedChats);

router.patch("/:id/members/:userId/promote", memberController.promoteUser);
router.patch("/:id/members/:userId/demote", memberController.demoteUser);

router.patch("/:id/members/me/last-read", memberController.updateLastRead);
router.patch("/:id/members/me/nickname", memberController.updateNickname);
router.patch("/:id/members/me/mute", memberController.muteConversation);
router.patch("/:id/members/me/archive", memberController.archiveConversation);

router.patch(
  "/:id/members/me/unarchive",
  memberController.unarchiveConversation,
);

router.patch("/:id/members/me/unmute", memberController.unmuteConversation);

router.get("/:id/members/count", memberController.countMembers);
router.get("/:id/members/ids", memberController.getMemberIds);

router.get(
  "/users/:userId/conversations",
  memberController.getUserConversationIds,
);
router.get(
  "/users/:userId/conversations/archived",
  memberController.listArchivedChats,
);
router.get("/users/:userId/conversations/muted", memberController.listMuted);

router.get(
  "/users/:userId/conversations/archived/count",
  memberController.countArchived,
);
router.get(
  "/users/:userId/conversations/muted/count",
  memberController.countMuted,
);

export default router;
