import { Router } from "express";
import { aiToolRoutes } from "./aiToolRoutes";
import { contactLeadRoutes } from "./contactLeadRoutes";
import { healthRoutes } from "./healthRoutes";
import { subscriptionPlanRoutes } from "./subscriptionPlanRoutes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/tools", aiToolRoutes);
router.use("/plans", subscriptionPlanRoutes);
router.use("/contact-leads", contactLeadRoutes);

export { router as apiRoutes };
