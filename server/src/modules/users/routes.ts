import Router from "express";
import { userController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, userController.getAllUsers);

router.get("/me", requireAuth, userController.getMe);

router.get("/:id", requireAuth, userController.getUserById);

router.patch("/me", requireAuth, userController.updateMe);

export default router;
