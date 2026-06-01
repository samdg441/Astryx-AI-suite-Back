import type { Request, Response } from "express";
import { prisma } from "../../infrastructure/database/prismaClient";

export class HealthController {
  async show(_request: Request, response: Response) {
    let database: "connected" | "disconnected" = "disconnected";
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "connected";
    } catch {
      database = "disconnected";
    }

    const ok = database === "connected";
    response.status(ok ? 200 : 503).json({
      status: ok ? "ok" : "degraded",
      service: "astryx-ai-suite-back",
      database,
      timestamp: new Date().toISOString(),
    });
  }
}
