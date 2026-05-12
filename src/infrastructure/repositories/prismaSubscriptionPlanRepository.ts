import type { SubscriptionPlan } from "../../domain/entities/subscriptionPlan";
import type { SubscriptionPlanRepository } from "../../domain/repositories/subscriptionPlanRepository";

/**
 * La tabla `planes` no existe en el despliegue mínimo (solo `usuarios` + `ias`).
 * Mantener GET /plans sin error del ORM.
 */
export class PrismaSubscriptionPlanRepository implements SubscriptionPlanRepository {
  async findActive(): Promise<SubscriptionPlan[]> {
    return [];
  }
}
