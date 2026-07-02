import { Router } from "express";
import authRoutes from "../modules/auth/routes";
import userRoutes from "../modules/users/routes";
import conversationRoutes from "../modules/conversations/routes";
import memberRoutes from "../modules/members/routes";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", requireAuth, memberRoutes);

export default router;
