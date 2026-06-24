import { Router } from "express";
import {
  getUserById,
  getUsers,
  registerUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", registerUser);

export default router;
