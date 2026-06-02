import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { AiStatusController } from "../controllers/aiStatusController";

const router = Router();
const controller = new AiStatusController();

router.get("/status", asyncHandler(controller.status.bind(controller)));

export { router as aiRoutes };
