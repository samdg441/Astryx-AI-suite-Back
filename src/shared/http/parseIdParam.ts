import { z } from "zod";
import type { Request } from "express";

const numericIdSchema = z.coerce.number().int().positive();

export function parseNumericIdParam(request: Request, paramName = "id"): number {
  return numericIdSchema.parse(request.params[paramName]);
}

const uuidSchema = z.string().uuid();

export function parseUuidParam(request: Request, paramName = "id"): string {
  return uuidSchema.parse(request.params[paramName]);
}
