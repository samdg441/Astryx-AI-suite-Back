import type { SubscriptionPlan } from "../../domain/entities/subscriptionPlan";
import type { SubscriptionPlanRepository } from "../../domain/repositories/subscriptionPlanRepository";
import { ACTIVE_SUBSCRIPTION_PLANS } from "../../shared/catalog/subscriptionPlansCatalog";

export class PrismaSubscriptionPlanRepository implements SubscriptionPlanRepository {
  async findActive(): Promise<SubscriptionPlan[]> {
    return ACTIVE_SUBSCRIPTION_PLANS;
  }
}
