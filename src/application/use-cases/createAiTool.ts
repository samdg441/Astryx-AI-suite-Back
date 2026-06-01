import type {
  AiToolRepository,
  CreateAiToolInput,
} from "../../domain/repositories/aiToolRepository";

export class CreateAiTool {
  constructor(private readonly aiToolRepository: AiToolRepository) {}

  execute(input: CreateAiToolInput) {
    return this.aiToolRepository.create(input);
  }
}
