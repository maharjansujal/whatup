import { Router } from "express";
import { blockController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/blocks", requireAuth, blockController.getBlockedUsers);
router.post("/block", requireAuth, blockController.blockUser);
router.delete("/unblock", requireAuth, blockController.unblockUser);
router.post("/can-communicate", requireAuth, blockController.canCommunicate);
