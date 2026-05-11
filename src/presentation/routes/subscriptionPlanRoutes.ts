import { Router } from "express";
import { ListSubscriptionPlans } from "../../application/use-cases/listSubscriptionPlans";
import { PrismaSubscriptionPlanRepository } from "../../infrastructure/repositories/prismaSubscriptionPlanRepository";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { SubscriptionPlanController } from "../controllers/subscriptionPlanController";

const router = Router();
const repository = new PrismaSubscriptionPlanRepository();
const useCase = new ListSubscriptionPlans(repository);
const controller = new SubscriptionPlanController(useCase);

router.get("/", asyncHandler(controller.index.bind(controller)));

export { router as subscriptionPlanRoutes };
