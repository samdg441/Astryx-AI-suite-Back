import type { ContactLead, CreateContactLeadInput } from "../../domain/entities/contactLead";
import type { ContactLeadRepository } from "../../domain/repositories/contactLeadRepository";

/**
 * Sin tabla `contact_leads` en el despliegue mínimo: no persistimos; evita error Prisma.
 */
export class PrismaContactLeadRepository implements ContactLeadRepository {
  async create(input: CreateContactLeadInput): Promise<ContactLead> {
    console.warn("[contact-leads] Sin tabla en BD; lead no guardado:", input.email);
    return {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      message: input.message,
      source: input.source ?? "website",
      createdAt: new Date(),
    };
  }
}
