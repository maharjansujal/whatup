import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { LoginSchema, RegisterSchema } from "./validator";
import { authController } from "./controller";

const router = Router();

router.post("/register", validate(RegisterSchema), authController.register);
router.post("/login", validate(LoginSchema), authController.login);
router.post("/logout", authController.logout);

export default router;
