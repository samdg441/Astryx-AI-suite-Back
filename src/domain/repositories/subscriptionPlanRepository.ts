import type { SubscriptionPlan } from "../entities/subscriptionPlan";

export interface SubscriptionPlanRepository {
  findActive(): Promise<SubscriptionPlan[]>;
}
