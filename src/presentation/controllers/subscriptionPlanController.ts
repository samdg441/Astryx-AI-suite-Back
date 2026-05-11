import type { Request, Response } from "express";
import type { ListSubscriptionPlans } from "../../application/use-cases/listSubscriptionPlans";

export class SubscriptionPlanController {
  constructor(private readonly listSubscriptionPlans: ListSubscriptionPlans) {}

  async index(_request: Request, response: Response) {
    const plans = await this.listSubscriptionPlans.execute();
    response.json({ data: plans });
  }
}
