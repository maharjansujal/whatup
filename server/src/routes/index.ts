import { Router } from "express";
import authRoutes from "../modules/auth/routes";
import userRoutes from "../modules/users/routes";
import conversationRoutes from "../modules/conversations/routes";
import memberRoutes from "../modules/members/routes";
import messagesRoutes from "../modules/messages/routes";
import receiptRoutes from "../modules/receipts/routes";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", requireAuth, userRoutes);
router.use("/conversations", conversationRoutes);
router.use("/conversations", requireAuth, memberRoutes);
router.use("/conversations", requireAuth, messagesRoutes);
router.use("/messages", requireAuth, receiptRoutes);

export default router;
