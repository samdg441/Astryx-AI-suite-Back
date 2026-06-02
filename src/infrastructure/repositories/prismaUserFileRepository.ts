import { prisma } from "../database/prismaClient";
import type {
  CreateUserFileInput,
  UserFileRecord,
  UserFileRepository,
} from "../../domain/repositories/userFileRepository";

function mapRecord(row: {
  id: string;
  userId: number;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  createdAt: Date;
}): UserFileRecord {
  return {
    id: row.id,
    userId: row.userId,
    originalName: row.originalName,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    storagePath: row.storagePath,
    createdAt: row.createdAt,
  };
}

export class PrismaUserFileRepository implements UserFileRepository {
  async create(input: CreateUserFileInput): Promise<UserFileRecord> {
    const row = await prisma.userFile.create({
      data: {
        userId: input.userId,
        originalName: input.originalName,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        storagePath: input.storagePath,
      },
    });
    return mapRecord(row);
  }

  async listByUser(userId: number): Promise<UserFileRecord[]> {
    const rows = await prisma.userFile.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapRecord);
  }

  async countByUser(userId: number): Promise<number> {
    return prisma.userFile.count({ where: { userId } });
  }

  async findByIdForUser(id: string, userId: number): Promise<UserFileRecord | null> {
    const row = await prisma.userFile.findFirst({
      where: { id, userId },
    });
    return row ? mapRecord(row) : null;
  }

  async deleteById(id: string): Promise<void> {
    await prisma.userFile.delete({ where: { id } });
  }
}

export const userFileRepository = new PrismaUserFileRepository();
