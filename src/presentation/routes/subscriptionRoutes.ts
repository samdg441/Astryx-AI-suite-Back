import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth } from "../../shared/http/requireAuth";
import { SubscriptionController } from "../controllers/subscriptionController";

const router = Router();
const controller = new SubscriptionController();

router.get("/status", requireAuth, asyncHandler(controller.status.bind(controller)));
router.post("/mock-activate", requireAuth, asyncHandler(controller.mockActivate.bind(controller)));

export { router as subscriptionRoutes };
