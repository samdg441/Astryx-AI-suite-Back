import type { AiTool } from "../entities/aiTool";

export interface AiToolRepository {
  findActive(): Promise<AiTool[]>;
}
