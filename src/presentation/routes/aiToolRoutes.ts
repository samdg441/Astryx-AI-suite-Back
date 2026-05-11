import { Router } from "express";
import { ListAiTools } from "../../application/use-cases/listAiTools";
import { PrismaAiToolRepository } from "../../infrastructure/repositories/prismaAiToolRepository";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { AiToolController } from "../controllers/aiToolController";

const router = Router();
const repository = new PrismaAiToolRepository();
const useCase = new ListAiTools(repository);
const controller = new AiToolController(useCase);

router.get("/", asyncHandler(controller.index.bind(controller)));

export { router as aiToolRoutes };
