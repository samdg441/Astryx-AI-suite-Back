import type { ContactLead, CreateContactLeadInput } from "../../domain/entities/contactLead";
import type { ContactLeadRepository } from "../../domain/repositories/contactLeadRepository";
import { prisma } from "../database/prismaClient";

export class PrismaContactLeadRepository implements ContactLeadRepository {
  create(input: CreateContactLeadInput): Promise<ContactLead> {
    return prisma.contactLead.create({
      data: {
        name: input.name,
        email: input.email,
        company: input.company,
        message: input.message,
        source: input.source ?? "website",
      },
    });
  }
}
