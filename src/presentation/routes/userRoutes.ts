import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth } from "../../shared/http/requireAuth";
import { UserController } from "../controllers/userController";

const router = Router();
const controller = new UserController();

router.get("/me", requireAuth, asyncHandler(controller.me.bind(controller)));
router.post("/plan/gratis", requireAuth, asyncHandler(controller.chooseGratis.bind(controller)));

export { router as userRoutes };
