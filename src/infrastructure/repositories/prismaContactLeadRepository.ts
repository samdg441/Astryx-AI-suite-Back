import type { Prisma } from "../../../generated/prisma/client";
import type {
  ContactLead,
  CreateContactLeadInput,
  UpdateContactLeadInput,
} from "../../domain/entities/contactLead";
import type {
  ContactLeadListFilters,
  ContactLeadListResult,
  ContactLeadRepository,
} from "../../domain/repositories/contactLeadRepository";
import { prisma } from "../database/prismaClient";

function buildWhere(filters: ContactLeadListFilters): Prisma.ContactLeadWhereInput {
  const where: Prisma.ContactLeadWhereInput = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.source) {
    where.source = filters.source;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  return where;
}

export class PrismaContactLeadRepository implements ContactLeadRepository {
  async findMany(
    filters: ContactLeadListFilters,
    page: number,
    limit: number,
  ): Promise<ContactLeadListResult> {
    const where = buildWhere(filters);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.contactLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contactLead.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<ContactLead | null> {
    return prisma.contactLead.findUnique({ where: { id } });
  }

  create(input: CreateContactLeadInput): Promise<ContactLead> {
    return prisma.contactLead.create({
      data: {
        name: input.name,
        email: input.email.trim().toLowerCase(),
        company: input.company ?? null,
        message: input.message,
        source: input.source ?? "website",
        status: "nuevo",
        userId: input.userId ?? null,
      },
    });
  }

  async update(id: string, input: UpdateContactLeadInput): Promise<ContactLead | null> {
    try {
      return await prisma.contactLead.update({
        where: { id },
        data: {
          ...(input.status !== undefined && { status: input.status }),
          ...(input.company !== undefined && { company: input.company }),
        },
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.contactLead.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
