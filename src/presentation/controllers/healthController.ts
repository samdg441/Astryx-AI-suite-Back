import type { Request, Response } from "express";

export class HealthController {
  async show(_request: Request, response: Response) {
    response.json({
      status: "ok",
      service: "astryx-ai-suite-back",
      timestamp: new Date().toISOString(),
    });
  }
}
