import { Router } from "express";
import authRoutes from "../modules/auth/routes";
import userRoutes from "../modules/users/routes";
import conversationRoutes from "../modules/conversations/routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);

export default router;
