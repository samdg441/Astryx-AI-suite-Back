import { Router } from "express";
import { aiToolRoutes } from "./aiToolRoutes";
import { authRoutes } from "./authRoutes";
import { checkoutRoutes } from "./checkoutRoutes";
import { contactLeadRoutes } from "./contactLeadRoutes";
import { aiRoutes } from "./aiRoutes";
import { chatRoutes } from "./chatRoutes";
import { healthRoutes } from "./healthRoutes";
import { subscriptionPlanRoutes } from "./subscriptionPlanRoutes";
import { subscriptionRoutes } from "./subscriptionRoutes";
import { userRoutes } from "./userRoutes";
import { adminUserRoutes } from "./adminUserRoutes";
import { fileRoutes } from "./fileRoutes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/ai", aiRoutes);
router.use("/chat", chatRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/tools", aiToolRoutes);
router.use("/plans", subscriptionPlanRoutes);
router.use("/contact-leads", contactLeadRoutes);
router.use("/users", adminUserRoutes);
router.use("/files", fileRoutes);

export { router as apiRoutes };
