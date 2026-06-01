import jwt from "jsonwebtoken";
import type { JwtPayload } from "./signToken";
import { env } from "../config/env";

function parseUserId(sub: unknown): number {
  if (typeof sub === "number" && Number.isFinite(sub)) {
    return sub;
  }
  const n = parseInt(String(sub), 10);
  if (!Number.isFinite(n)) {
    throw new Error("Invalid token subject");
  }
  return n;
}

/** Valida JWT de acceso y devuelve payload tipado. */
export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload");
  }
  const o = decoded as Record<string, unknown>;
  const email = typeof o.email === "string" ? o.email : "";
  const planType = typeof o.planType === "string" ? o.planType : "sin_plan";
  const globalRole = typeof o.globalRole === "string" ? o.globalRole : "usuario";
  return {
    sub: parseUserId(o.sub),
    email,
    planType,
    globalRole,
  };
}
