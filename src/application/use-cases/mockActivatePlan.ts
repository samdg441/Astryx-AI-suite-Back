import { prisma } from "../../infrastructure/database/prismaClient";
import { env } from "../../shared/config/env";
import { HttpError } from "../../shared/errors/httpError";

const ALLOWED = new Set(["free", "basico", "pro", "empresarial"]);

export type MockPlanTarget = "free" | "basico" | "pro" | "empresarial";

export type MockPaymentMethod = {
  last4: string;
  brand: "visa" | "mastercard" | "amex";
};

export async function mockActivatePlan(
  userId: number,
  targetPlan: MockPlanTarget,
  paymentMethod?: MockPaymentMethod,
): Promise<void> {
  if (!env.MOCK_CHECKOUT_ENABLED) {
    throw new HttpError(403, "Mock checkout deshabilitado en este entorno");
  }
  if (!ALLOWED.has(targetPlan)) {
    throw new HttpError(400, "Plan no válido");
  }
  const user = await prisma.user.findFirst({ where: { id: userId, isActive: true } });
  if (!user) {
    throw new HttpError(404, "Usuario no encontrado");
  }
  const mockCustomerId = paymentMethod
    ? `mock_${paymentMethod.brand}_${paymentMethod.last4}`
    : user.stripeCustomerId ?? `mock_cus_${userId}`;

  await prisma.user.update({
    where: { id: userId },
    data: {
      planType: targetPlan,
      subscriptionStatus: targetPlan === "free" ? "inactivo" : "activo",
      stripeCustomerId: mockCustomerId,
    },
  });
}
