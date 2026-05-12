import { prisma } from "../../infrastructure/database/prismaClient";
import { HttpError } from "../../shared/errors/httpError";

/** Primera elección de plan: marcar cuenta como gratuita (solo si aún no eligió). */
export async function chooseFreePlan(userId: number): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { id: userId, isActive: true },
    select: { planType: true },
  });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  if (user.planType !== null) {
    throw new HttpError(400, "Ya tienes un plan asignado");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      planType: "free",
      subscriptionStatus: "inactivo",
    },
  });
}
