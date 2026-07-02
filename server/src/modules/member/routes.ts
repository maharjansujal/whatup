import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth);
