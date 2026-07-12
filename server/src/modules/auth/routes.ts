import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { LoginSchema, RegisterSchema } from "./validator";
import { authController } from "./controller";
import { upload } from "../../shared/cloudinary/multer";

const router = Router();

router.post(
  "/register",
  upload.single("avatar"),
  validate(RegisterSchema),
  authController.register,
);
router.post("/login", validate(LoginSchema), authController.login);
router.post("/logout", authController.logout);

export default router;
