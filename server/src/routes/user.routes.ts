import { Router } from "express";
import {
  getMe,
  getUserById,
  getUsers,
  updateStatus,
  updateUser,
  uploadAvatar,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { login, register } from "../controllers/auth.controller";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.get("/me", authMiddleware, getMe);
router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("image"),
  uploadAvatar,
);
router.post("/register", upload.single("image"), register);
router.patch("/me", authMiddleware, upload.single("image"), updateUser);
router.post("/login", login);
router.patch("/my-status", authMiddleware, updateStatus);

export default router;
