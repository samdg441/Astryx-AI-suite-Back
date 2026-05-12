import type { Request, Response } from "express";
import { z } from "zod";
import { createCheckoutSession } from "../../application/use-cases/createCheckoutSession";

const bodySchema = z.object({
  priceTier: z.enum(["basico", "pro", "empresarial"]),
});

export class CheckoutController {
  async createSession(request: Request, response: Response) {
    const auth = request.auth;
    if (!auth) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { priceTier } = bodySchema.parse(request.body);
    const { url } = await createCheckoutSession({ userId: auth.userId, priceTier });
    response.status(200).json({ data: { url } });
  }
}
