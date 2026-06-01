import type { AiTool } from "../entities/aiTool";

export type AiToolListFilters = {
  category?: string;
  requiredPlan?: string;
  isActive?: boolean;
  search?: string;
};

export type AiToolListResult = {
  items: AiTool[];
  total: number;
};

export type CreateAiToolInput = {
  name: string;
  provider?: string | null;
  description: string;
  category: string;
  urlApi?: string | null;
  requiredPlan: string;
  isActive?: boolean;
};

export type UpdateAiToolInput = Partial<CreateAiToolInput>;

export interface AiToolRepository {
  findMany(
    filters: AiToolListFilters,
    page: number,
    limit: number,
  ): Promise<AiToolListResult>;
  findById(id: number): Promise<AiTool | null>;
  create(input: CreateAiToolInput): Promise<AiTool>;
  update(id: number, input: UpdateAiToolInput): Promise<AiTool | null>;
  delete(id: number): Promise<boolean>;
}
