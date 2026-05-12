import { prisma } from "../../infrastructure/database/prismaClient";
import { HttpError } from "../../shared/errors/httpError";

export type CurrentUserDto = {
  id: number;
  name: string;
  email: string;
  globalRole: string;
  planType: string;
  subscriptionStatus: string;
  stripeCustomerId: string | null;
};

export async function getCurrentUser(userId: number): Promise<CurrentUserDto> {
  const user = await prisma.user.findFirst({
    where: { id: userId, isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      globalRole: true,
      planType: true,
      subscriptionStatus: true,
      stripeCustomerId: true,
    },
  });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return user;
}
