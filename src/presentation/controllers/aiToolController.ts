import type { Request, Response } from "express";
import type { ListAiTools } from "../../application/use-cases/listAiTools";

export class AiToolController {
  constructor(private readonly listAiTools: ListAiTools) {}

  async index(_request: Request, response: Response) {
    const tools = await this.listAiTools.execute();
    const data = tools.map((t) => ({
      id: t.id,
      name: t.name,
      provider: t.provider,
      description: t.description,
      category: t.category,
      required_plan: t.requiredPlan,
      isActive: t.isActive,
      is_premium: t.requiredPlan !== "free",
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
    response.json({ data });
  }
}
