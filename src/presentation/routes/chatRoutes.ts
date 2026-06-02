import { Router } from "express";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth } from "../../shared/http/requireAuth";
import { ChatController } from "../controllers/chatController";

const router = Router();
const controller = new ChatController();

router.post("/", requireAuth, asyncHandler(controller.send.bind(controller)));

export { router as chatRoutes };
