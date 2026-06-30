import Router from "express";
import { userController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, userController.getAllUsers);

router.get("/:id", requireAuth, userController.getUserById);

export default router;
