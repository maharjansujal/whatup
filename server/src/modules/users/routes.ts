import Router from "express";
import { userController } from "./controller";

const router = Router();

router.get("/", userController.getAllUsers);

export default router;
