import type { RequestHandler } from "express";
import { verifyAccessToken } from "../auth/verifyToken";
import { HttpError } from "../errors/httpError";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) {
    next(new HttpError(401, "Unauthorized"));
    return;
  }
  try {
    const payload = verifyAccessToken(token);
    req.auth = {
      userId: payload.sub,
      email: payload.email,
      planType: payload.planType,
    };
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
};
