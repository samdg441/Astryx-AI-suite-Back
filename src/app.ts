import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { stripeWebhookHandler } from "./presentation/controllers/stripeWebhookController";
import { apiRoutes } from "./presentation/routes";
import { env } from "./shared/config/env";
import { errorMiddleware } from "./shared/http/errorMiddleware";
import { asyncHandler } from "./shared/http/asyncHandler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));

  /** Stripe webhook: raw body obligatorio para verificar la firma (no pasar por express.json). */
  app.post(
    `${env.API_PREFIX}/webhooks/stripe`,
    express.raw({ type: "application/json" }),
    asyncHandler(async (req, res) => {
      await stripeWebhookHandler(req, res);
    }),
  );

  app.use(express.json());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.use(env.API_PREFIX, apiRoutes);

  app.use(errorMiddleware);

  return app;
}
