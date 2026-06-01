import type { Request, Response } from "express";
import { z } from "zod";
import type { CreateContactLead } from "../../application/use-cases/createContactLead";
import type { DeleteContactLead } from "../../application/use-cases/deleteContactLead";
import type { GetContactLeadById } from "../../application/use-cases/getContactLeadById";
import type { ListContactLeads } from "../../application/use-cases/listContactLeads";
import type { UpdateContactLead } from "../../application/use-cases/updateContactLead";
import {
  buildPaginationMeta,
  parsePaginationQuery,
} from "../../shared/http/pagination";
import { parseUuidParam } from "../../shared/http/parseIdParam";

const createContactLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10).max(2000),
  source: z.string().trim().max(80).optional(),
});

const listQuerySchema = z.object({
  status: z.enum(["nuevo", "leido", "cerrado"]).optional(),
  source: z.string().trim().min(1).max(80).optional(),
  search: z.string().trim().min(1).max(120).optional(),
});

const updateContactLeadSchema = z.object({
  status: z.enum(["nuevo", "leido", "cerrado"]).optional(),
  company: z.string().trim().max(120).nullable().optional(),
});

function serializeContactLead(lead: {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  status: string;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    message: lead.message,
    source: lead.source,
    status: lead.status,
    userId: lead.userId,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}

export class ContactLeadController {
  constructor(
    private readonly createContactLead: CreateContactLead,
    private readonly listContactLeads: ListContactLeads,
    private readonly getContactLeadById: GetContactLeadById,
    private readonly updateContactLead: UpdateContactLead,
    private readonly deleteContactLead: DeleteContactLead,
  ) {}

  async create(request: Request, response: Response) {
    const input = createContactLeadSchema.parse(request.body);
    const lead = await this.createContactLead.execute({
      ...input,
      userId: request.auth?.userId ?? null,
    });
    response.status(201).json({ data: serializeContactLead(lead) });
  }

  async index(request: Request, response: Response) {
    const { page, limit } = parsePaginationQuery(request);
    const filters = listQuerySchema.parse(request.query);
    const result = await this.listContactLeads.execute(filters, page, limit);
    response.status(200).json({
      data: result.items.map(serializeContactLead),
      meta: buildPaginationMeta(page, limit, result.total),
    });
  }

  async show(request: Request, response: Response) {
    const id = parseUuidParam(request);
    const lead = await this.getContactLeadById.execute(id);
    response.status(200).json({ data: serializeContactLead(lead) });
  }

  async update(request: Request, response: Response) {
    const id = parseUuidParam(request);
    const input = updateContactLeadSchema.parse(request.body);
    const lead = await this.updateContactLead.execute(id, input);
    response.status(200).json({ data: serializeContactLead(lead) });
  }

  async destroy(request: Request, response: Response) {
    const id = parseUuidParam(request);
    await this.deleteContactLead.execute(id);
    response.status(204).send();
  }
}
