import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth } from "../../shared/http/requireAuth";
import { CheckoutController } from "../controllers/checkoutController";

const router = Router();
const controller = new CheckoutController();

router.post("/create-session", requireAuth, asyncHandler(controller.createSession.bind(controller)));

export { router as checkoutRoutes };
