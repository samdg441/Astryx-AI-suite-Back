import cors from "cors";
import type { CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { stripeWebhookHandler } from "./presentation/controllers/stripeWebhookController";
import { apiRoutes } from "./presentation/routes";
import { env } from "./shared/config/env";
import { errorMiddleware } from "./shared/http/errorMiddleware";
import { asyncHandler } from "./shared/http/asyncHandler";

const LOCALHOST_ORIGIN = /^http:\/\/localhost:\d+$/;

function createCorsOptions(): CorsOptions {
  const allowedOrigins = env.CORS_ORIGIN.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      if (env.NODE_ENV === "development" && LOCALHOST_ORIGIN.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS: origen no permitido (${origin})`));
    },
  };
}

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors(createCorsOptions()));

  /** Stripe webhook: body raw para verificar firma */
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
