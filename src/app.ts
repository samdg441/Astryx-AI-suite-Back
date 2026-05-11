import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./shared/config/env";
import { errorMiddleware } from "./shared/http/errorMiddleware";
import { apiRoutes } from "./presentation/routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.use(env.API_PREFIX, apiRoutes);

  app.use(errorMiddleware);

  return app;
}
