import type { Request, Response } from "express";
import { z } from "zod";
import { getCurrentUser } from "../../application/use-cases/getCurrentUser";
import { getSubscriptionStatus } from "../../application/use-cases/getSubscriptionStatus";
import { mockActivatePlan, type MockPlanTarget } from "../../application/use-cases/mockActivatePlan";
import { signToken } from "../../shared/auth/signToken";

const mockBody = z.object({
  targetPlan: z.enum(["free", "basico", "pro", "empresarial"]),
});

export class SubscriptionController {
  async status(request: Request, response: Response) {
    const auth = request.auth;
    if (!auth) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }
    const data = await getSubscriptionStatus(auth.userId);
    response.status(200).json({ data });
  }

  async mockActivate(request: Request, response: Response) {
    const auth = request.auth;
    if (!auth) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { targetPlan } = mockBody.parse(request.body);
    await mockActivatePlan(auth.userId, targetPlan as MockPlanTarget);
    const user = await getCurrentUser(auth.userId);
    const token = signToken(user.id, user.email, user.planType ?? "sin_plan");
    response.status(200).json({
      data: {
        token,
        user,
      },
    });
  }
}