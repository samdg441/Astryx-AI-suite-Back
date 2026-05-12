import jwt from "jsonwebtoken";

export type JwtPayload = {
  sub: number;
  email: string;
  planType: string;
};

/** Secreto fijo en código por ahora; en producción mover a variable de entorno segura. */
const JWT_SIGNING_SECRET = "astryx-dev-jwt-secret-min-16";

export function signToken(userId: number, email: string, planType: string): string {
  return jwt.sign({ sub: userId, email, planType }, JWT_SIGNING_SECRET, { expiresIn: "7d" });
}
