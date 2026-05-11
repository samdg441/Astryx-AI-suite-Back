import type { SubscriptionPlan } from "../../domain/entities/subscriptionPlan";
import type { SubscriptionPlanRepository } from "../../domain/repositories/subscriptionPlanRepository";
import { prisma } from "../database/prismaClient";

export class PrismaSubscriptionPlanRepository implements SubscriptionPlanRepository {
  async findActive(): Promise<SubscriptionPlan[]> {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { status: { in: ["activo", "activa", "active"] } },
      orderBy: { monthlyPrice: "asc" },
    });

    return plans.map((plan) => ({
      ...plan,
      monthlyPrice: Number(plan.monthlyPrice),
    }));
  }
}
