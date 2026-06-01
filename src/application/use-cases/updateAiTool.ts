import type {
  AiToolRepository,
  UpdateAiToolInput,
} from "../../domain/repositories/aiToolRepository";
import { HttpError } from "../../shared/errors/httpError";

export class UpdateAiTool {
  constructor(private readonly aiToolRepository: AiToolRepository) {}

  async execute(id: number, input: UpdateAiToolInput) {
    const updated = await this.aiToolRepository.update(id, input);
    if (!updated) {
      throw new HttpError(404, "AI tool not found");
    }
    return updated;
  }
}
