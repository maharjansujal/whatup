import { Router } from "express";
import authRoutes from "../modules/auth/routes";
import userRoutes from "../modules/users/routes";
import conversationRoutes from "../modules/conversations/routes";
import memberRoutes from "../modules/members/routes";
import messagesRoutes from "../modules/messages/routes";
import receiptRoutes from "../modules/receipts/routes";
import inviteRoutes from "../modules/invite/routes";
import blockRoutes from "../modules/block/routes";
import requestRoutes from "../modules/requests/routes";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);
router.use("/members", requireAuth, memberRoutes);
router.use("/conversations", requireAuth, messagesRoutes);
router.use("/receipt", requireAuth, receiptRoutes);
router.use("/invite", requireAuth, inviteRoutes);
router.use("/block", requireAuth, blockRoutes);
router.use("/request", requireAuth, requestRoutes);

export default router;
