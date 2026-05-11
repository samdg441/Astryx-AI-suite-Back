import type { SubscriptionPlanRepository } from "../../domain/repositories/subscriptionPlanRepository";

export class ListSubscriptionPlans {
  constructor(private readonly subscriptionPlanRepository: SubscriptionPlanRepository) {}

  execute() {
    return this.subscriptionPlanRepository.findActive();
  }
}
