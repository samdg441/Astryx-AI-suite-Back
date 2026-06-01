import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = {
  sub: number;
  email: string;
  planType: string;
  globalRole: string;
};

export function signToken(
  userId: number,
  email: string,
  planType: string,
  globalRole: string,
): string {
  return jwt.sign({ sub: userId, email, planType, globalRole }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
