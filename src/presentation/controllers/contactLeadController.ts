import type { Request, Response } from "express";
import { z } from "zod";
import type { CreateContactLead } from "../../application/use-cases/createContactLead";

const createContactLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10).max(2000),
  source: z.string().trim().max(80).optional(),
});

export class ContactLeadController {
  constructor(private readonly createContactLead: CreateContactLead) {}

  async create(request: Request, response: Response) {
    const input = createContactLeadSchema.parse(request.body);
    const lead = await this.createContactLead.execute(input);
    response.status(201).json({ data: lead });
  }
}
