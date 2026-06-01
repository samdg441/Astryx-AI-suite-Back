import type { Prisma } from "../../../generated/prisma/client";
import type { AiTool } from "../../domain/entities/aiTool";
import type {
  AiToolListFilters,
  AiToolListResult,
  AiToolRepository,
  CreateAiToolInput,
  UpdateAiToolInput,
} from "../../domain/repositories/aiToolRepository";
import { prisma } from "../database/prismaClient";

function buildWhere(filters: AiToolListFilters): Prisma.AiToolWhereInput {
  const where: Prisma.AiToolWhereInput = {};
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.requiredPlan) {
    where.requiredPlan = filters.requiredPlan;
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  return where;
}

export class PrismaAiToolRepository implements AiToolRepository {
  async findMany(
    filters: AiToolListFilters,
    page: number,
    limit: number,
  ): Promise<AiToolListResult> {
    const where = buildWhere(filters);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.aiTool.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      prisma.aiTool.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: number): Promise<AiTool | null> {
    return prisma.aiTool.findUnique({ where: { id } });
  }

  create(input: CreateAiToolInput): Promise<AiTool> {
    return prisma.aiTool.create({
      data: {
        name: input.name,
        provider: input.provider ?? null,
        description: input.description,
        category: input.category,
        urlApi: input.urlApi ?? null,
        requiredPlan: input.requiredPlan,
        isActive: input.isActive ?? true,
      },
    });
  }

  async update(id: number, input: UpdateAiToolInput): Promise<AiTool | null> {
    try {
      return await prisma.aiTool.update({
        where: { id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.provider !== undefined && { provider: input.provider }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.category !== undefined && { category: input.category }),
          ...(input.urlApi !== undefined && { urlApi: input.urlApi }),
          ...(input.requiredPlan !== undefined && { requiredPlan: input.requiredPlan }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
        },
      });
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.aiTool.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
