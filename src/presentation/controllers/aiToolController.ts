import type { Request, Response } from "express";
import type { ListAiTools } from "../../application/use-cases/listAiTools";

export class AiToolController {
  constructor(private readonly listAiTools: ListAiTools) {}

  async index(_request: Request, response: Response) {
    const tools = await this.listAiTools.execute();
    response.json({ data: tools });
  }
}
