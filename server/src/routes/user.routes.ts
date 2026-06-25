import { Router } from "express";
import {
  getUserById,
  getUsers,
  uploadAvatar,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { login, register } from "../controllers/auth.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("image"),
  uploadAvatar,
);
router.post("/register", upload.single("image"), register);

router.post("/login", login);

export default router;
