import bcrypt from "bcrypt";
import { prisma } from "../../infrastructure/database/prismaClient";
import { HttpError } from "../../shared/errors/httpError";
import { signToken } from "../../shared/auth/signToken";

export type LoginUserInput = {
  email: string;
  password: string;
};

export type LoginUserResult = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    globalRole: string;
    planType: string;
    subscriptionStatus: string;
  };
};

export async function loginUser(input: LoginUserInput): Promise<LoginUserResult> {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    throw new HttpError(401, "Invalid email or password");
  }

  const passwordOk = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordOk) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signToken(user.id, user.email, user.planType);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      globalRole: user.globalRole,
      planType: user.planType,
      subscriptionStatus: user.subscriptionStatus,
    },
  };
}
