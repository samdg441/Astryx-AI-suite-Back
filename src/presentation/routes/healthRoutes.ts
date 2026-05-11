import { Router } from "express";
import { HealthController } from "../controllers/healthController";
import { asyncHandler } from "../../shared/http/asyncHandler";

const router = Router();
const healthController = new HealthController();

router.get("/", asyncHandler(healthController.show.bind(healthController)));

export { router as healthRoutes };
