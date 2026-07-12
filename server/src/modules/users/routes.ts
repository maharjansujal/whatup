import Router from "express";
import { userController } from "./controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { upload } from "../../shared/cloudinary/multer";
import { UpdatePasswordSchema, UserStatusSchema } from "./types";

const router = Router();

router.get("/", userController.getAllUsers);

router.get("/me", userController.getMe);

router.get("/:id", userController.getUserById);

router.patch("/me", userController.updateMe);

router.patch(
  "/me/avatar",
  upload.single("avatar"),
  userController.updateAvatar,
);

router.patch(
  "/me/password",
  validate(UpdatePasswordSchema),
  userController.updatePassword,
);

router.put("/status", validate(UserStatusSchema), userController.updateStatus);

router.delete("/status", userController.deleteStatus);

export default router;
