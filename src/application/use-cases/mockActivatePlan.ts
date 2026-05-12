import { prisma } from "../../infrastructure/database/prismaClient";
import { env } from "../../shared/config/env";
import { HttpError } from "../../shared/errors/httpError";

const ALLOWED = new Set(["free", "basico", "pro", "empresarial"]);

export type MockPlanTarget = "free" | "basico" | "pro" | "empresarial";

/**
 * Solo para demos / sin Stripe. Desactivar en producción con MOCK_CHECKOUT_ENABLED=false.
 */
export async function mockActivatePlan(userId: number, targetPlan: MockPlanTarget): Promise<void> {
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
  await prisma.user.update({
    where: { id: userId },
    data: {
      planType: targetPlan,
      subscriptionStatus: targetPlan === "free" ? "inactivo" : "activo",
    },
  });
}
