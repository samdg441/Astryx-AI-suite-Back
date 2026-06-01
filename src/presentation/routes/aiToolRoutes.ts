import { Router } from "express";
import { CreateAiTool } from "../../application/use-cases/createAiTool";
import { DeleteAiTool } from "../../application/use-cases/deleteAiTool";
import { GetAiToolById } from "../../application/use-cases/getAiToolById";
import { ListAiTools } from "../../application/use-cases/listAiTools";
import { UpdateAiTool } from "../../application/use-cases/updateAiTool";
import { PrismaAiToolRepository } from "../../infrastructure/repositories/prismaAiToolRepository";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAdmin } from "../../shared/http/requireAdmin";
import { requireAuth } from "../../shared/http/requireAuth";
import { AiToolController } from "../controllers/aiToolController";

const router = Router();
const repository = new PrismaAiToolRepository();
const controller = new AiToolController(
  new ListAiTools(repository),
  new GetAiToolById(repository),
  new CreateAiTool(repository),
  new UpdateAiTool(repository),
  new DeleteAiTool(repository),
);

router.get("/", asyncHandler(controller.index.bind(controller)));
router.get("/:id", asyncHandler(controller.show.bind(controller)));

router.post("/", requireAuth, requireAdmin, asyncHandler(controller.create.bind(controller)));
router.put("/:id", requireAuth, requireAdmin, asyncHandler(controller.update.bind(controller)));
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(controller.destroy.bind(controller)),
);

export { router as aiToolRoutes };
