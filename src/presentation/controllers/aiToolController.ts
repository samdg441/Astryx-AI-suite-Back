import type { Request, Response } from "express";
import { z } from "zod";
import type { CreateAiTool } from "../../application/use-cases/createAiTool";
import type { DeleteAiTool } from "../../application/use-cases/deleteAiTool";
import type { GetAiToolById } from "../../application/use-cases/getAiToolById";
import type { ListAiTools } from "../../application/use-cases/listAiTools";
import type { UpdateAiTool } from "../../application/use-cases/updateAiTool";
import {
  buildPaginationMeta,
  parsePaginationQuery,
} from "../../shared/http/pagination";
import { parseNumericIdParam } from "../../shared/http/parseIdParam";

const planSchema = z.enum(["free", "basico", "pro", "empresarial"]);

const listQuerySchema = z.object({
  category: z.string().trim().min(1).max(40).optional(),
  requiredPlan: planSchema.optional(),
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  search: z.string().trim().min(1).max(120).optional(),
});

const createAiToolSchema = z.object({
  name: z.string().trim().min(2).max(80),
  provider: z.string().trim().max(80).nullable().optional(),
  description: z.string().trim().min(10).max(4000),
  category: z.string().trim().min(2).max(40),
  urlApi: z.string().trim().url().max(600).nullable().optional(),
  requiredPlan: planSchema.default("free"),
  isActive: z.boolean().optional(),
});

const updateAiToolSchema = createAiToolSchema.partial();

function serializeAiTool(t: {
  id: number;
  name: string;
  provider: string | null;
  description: string;
  category: string;
  urlApi: string | null;
  requiredPlan: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: t.id,
    name: t.name,
    provider: t.provider,
    description: t.description,
    category: t.category,
    url_api: t.urlApi,
    required_plan: t.requiredPlan,
    isActive: t.isActive,
    is_premium: t.requiredPlan !== "free",
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export class AiToolController {
  constructor(
    private readonly listAiTools: ListAiTools,
    private readonly getAiToolById: GetAiToolById,
    private readonly createAiTool: CreateAiTool,
    private readonly updateAiTool: UpdateAiTool,
    private readonly deleteAiTool: DeleteAiTool,
  ) {}

  async index(request: Request, response: Response) {
    const { page, limit } = parsePaginationQuery(request);
    const filters = listQuerySchema.parse(request.query);
    const result = await this.listAiTools.execute(filters, page, limit);
    response.status(200).json({
      data: result.items.map(serializeAiTool),
      meta: buildPaginationMeta(page, limit, result.total),
    });
  }

  async show(request: Request, response: Response) {
    const id = parseNumericIdParam(request);
    const tool = await this.getAiToolById.execute(id);
    response.status(200).json({ data: serializeAiTool(tool) });
  }

  async create(request: Request, response: Response) {
    const input = createAiToolSchema.parse(request.body);
    const tool = await this.createAiTool.execute(input);
    response.status(201).json({ data: serializeAiTool(tool) });
  }

  async update(request: Request, response: Response) {
    const id = parseNumericIdParam(request);
    const input = updateAiToolSchema.parse(request.body);
    const tool = await this.updateAiTool.execute(id, input);
    response.status(200).json({ data: serializeAiTool(tool) });
  }

  async destroy(request: Request, response: Response) {
    const id = parseNumericIdParam(request);
    await this.deleteAiTool.execute(id);
    response.status(204).send();
  }
}
