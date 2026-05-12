import { Router } from "express";
import { aiToolRoutes } from "./aiToolRoutes";
import { authRoutes } from "./authRoutes";
import { checkoutRoutes } from "./checkoutRoutes";
import { contactLeadRoutes } from "./contactLeadRoutes";
import { healthRoutes } from "./healthRoutes";
import { subscriptionPlanRoutes } from "./subscriptionPlanRoutes";
import { subscriptionRoutes } from "./subscriptionRoutes";
import { userRoutes } from "./userRoutes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/tools", aiToolRoutes);
router.use("/plans", subscriptionPlanRoutes);
router.use("/contact-leads", contactLeadRoutes);

export { router as apiRoutes };
