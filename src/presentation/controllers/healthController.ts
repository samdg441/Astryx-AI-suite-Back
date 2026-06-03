import type { Request, Response } from "express";
import { prisma } from "../../infrastructure/database/prismaClient";
import { isStorageConfigured } from "../../infrastructure/storage/supabaseStorageClient";

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
      storage: isStorageConfigured() ? "configured" : "not_configured",
      timestamp: new Date().toISOString(),
    });
  }
}
