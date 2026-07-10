import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { receiptsController } from "./controller";

const router = Router();

router.post("/:id/receipts", requireAuth, receiptsController.createReceipt);

router.patch(
  "/:id/receipts/delivered",
  requireAuth,
  receiptsController.markDelivered,
);

router.patch("/:id/receipts/seen", requireAuth, receiptsController.markSeen);

router.get("/:id/receipts", requireAuth, receiptsController.getReceipts);

router.get("/:id/receipts/seen", requireAuth, receiptsController.getSeenUsers);

router.get(
  "/:id/receipts/delivered",
  requireAuth,
  receiptsController.getDeliveredUsers,
);

export default router;
