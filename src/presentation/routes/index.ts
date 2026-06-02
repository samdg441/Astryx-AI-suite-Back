import { Router } from "express";
import { env } from "../../shared/config/env";
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

/** Página de bienvenida al abrir /api/v1 en el navegador */
router.get("/", (_req, res) => {
  const base = env.API_PREFIX;
  res.status(200).json({
    service: "Astryx AI Suite API",
    version: "v1",
    status: "online",
    documentation: "https://github.com/samdg441/Astryx-AI-suite-Back",
    endpoints: {
      health: `${base}/health`,
      aiStatus: `${base}/ai/status`,
      tools: `${base}/tools`,
      plans: `${base}/plans`,
      auth: { register: `${base}/auth/register`, login: `${base}/auth/login` },
      chat: `${base}/chat (POST, JWT)`,
      files: `${base}/files (JWT)`,
    },
    hint: "Abre /health para comprobar servidor y base de datos.",
  });
});

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
