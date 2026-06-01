import type { AiToolRepository } from "../../domain/repositories/aiToolRepository";
import { HttpError } from "../../shared/errors/httpError";

export class DeleteAiTool {
  constructor(private readonly aiToolRepository: AiToolRepository) {}

  async execute(id: number) {
    const deleted = await this.aiToolRepository.delete(id);
    if (!deleted) {
      throw new HttpError(404, "AI tool not found");
    }
  }
}
