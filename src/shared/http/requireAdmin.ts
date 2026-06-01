import type { RequestHandler } from "express";
import { HttpError } from "../errors/httpError";

/** Debe usarse después de `requireAuth`. Solo rol `admin` puede continuar. */
export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.auth) {
    next(new HttpError(401, "Unauthorized"));
    return;
  }
  if (req.auth.globalRole !== "admin") {
    next(new HttpError(403, "Forbidden: admin role required"));
    return;
  }
  next();
};
