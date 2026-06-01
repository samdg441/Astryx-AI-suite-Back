import { prisma } from "../../infrastructure/database/prismaClient";

export type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  globalRole: string;
  planType: string | null;
  subscriptionStatus: string;
  isActive: boolean;
  createdAt: Date;
};

export async function listUsersAdmin(
  page: number,
  limit: number,
): Promise<{ items: AdminUserRow[]; total: number }> {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        globalRole: true,
        planType: true,
        subscriptionStatus: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
  ]);
  return { items, total };
}
