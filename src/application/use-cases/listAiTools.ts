import type { AiToolRepository } from "../../domain/repositories/aiToolRepository";

export class ListAiTools {
  constructor(private readonly aiToolRepository: AiToolRepository) {}

  execute() {
    return this.aiToolRepository.findActive();
  }
}
