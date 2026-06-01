import type {
  AiToolListFilters,
  AiToolRepository,
} from "../../domain/repositories/aiToolRepository";

export class ListAiTools {
  constructor(private readonly aiToolRepository: AiToolRepository) {}

  execute(filters: AiToolListFilters, page: number, limit: number) {
    return this.aiToolRepository.findMany(filters, page, limit);
  }
}
