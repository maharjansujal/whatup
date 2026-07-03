import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requestsController } from "./controller";

const router = Router();

// Create a new request under a conversation
router.post(
  "/conversations/:id/requests",
  requireAuth,
  requestsController.createRequest,
);

router.get("/requests/pending", requireAuth, requestsController.findPending);

router.get("/requests/:id", requireAuth, requestsController.findById);

router.patch("/requests/:id/accept", requireAuth, requestsController.accept);

router.patch("/requests/:id/decline", requireAuth, requestsController.decline);

router.patch("/requests/:id/cancel", requireAuth, requestsController.cancel);

router.get("/requests/incoming", requireAuth, requestsController.listIncoming);

router.get("/requests/outgoing", requireAuth, requestsController.listOutgoing);

export default router;
