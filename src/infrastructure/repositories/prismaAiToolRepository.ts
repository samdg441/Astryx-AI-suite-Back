import type { AiTool } from "../../domain/entities/aiTool";
import type { AiToolRepository } from "../../domain/repositories/aiToolRepository";
import { prisma } from "../database/prismaClient";

export class PrismaAiToolRepository implements AiToolRepository {
  findActive(): Promise<AiTool[]> {
    return prisma.aiTool.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }
}
