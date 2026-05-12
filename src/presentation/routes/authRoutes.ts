import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { AuthController } from "../controllers/authController";

const router = Router();
const controller = new AuthController();

router.post("/register", asyncHandler(controller.register.bind(controller)));
router.post("/login", asyncHandler(controller.login.bind(controller)));

export { router as authRoutes };
