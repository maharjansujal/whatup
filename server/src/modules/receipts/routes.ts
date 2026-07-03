import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { receiptsController } from "./controller";

const router = Router();

router.post(
  "/messages/:id/receipts",
  requireAuth,
  receiptsController.createReceipt,
);

router.patch(
  "/messages/:id/receipts/delivered",
  requireAuth,
  receiptsController.markDelivered,
);

router.patch(
  "/messages/:id/receipts/seen",
  requireAuth,
  receiptsController.markSeen,
);

router.get(
  "/messages/:id/receipts",
  requireAuth,
  receiptsController.getReceipts,
);

router.get(
  "/messages/:id/receipts/seen",
  requireAuth,
  receiptsController.getSeenUsers,
);

router.get(
  "/messages/:id/receipts/delivered",
  requireAuth,
  receiptsController.getDeliveredUsers,
);

export default router;
