import type { AiToolRepository } from "../../domain/repositories/aiToolRepository";
import { HttpError } from "../../shared/errors/httpError";

export class GetAiToolById {
  constructor(private readonly aiToolRepository: AiToolRepository) {}

  async execute(id: number) {
    const tool = await this.aiToolRepository.findById(id);
    if (!tool) {
      throw new HttpError(404, "AI tool not found");
    }
    return tool;
  }
}
