import Router from "express";
import { userController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { upload } from "../../shared/cloudinary/multer";
import { UpdatePasswordSchema } from "./types";

const router = Router();

router.get("/", requireAuth, userController.getAllUsers);

router.get("/me", requireAuth, userController.getMe);

router.get("/:id", requireAuth, userController.getUserById);

router.patch("/me", requireAuth, userController.updateMe);

router.patch(
  "/me/avatar",
  upload.single("avatar"),
  requireAuth,
  userController.updateAvatar,
);

router.patch(
  "/me/password",
  validate(UpdatePasswordSchema),
  requireAuth,
  userController.updatePassword,
);

export default router;
