import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../errors/httpError";

function getPrismaErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  if (!("code" in error)) return null;
  const code = (error as { code: unknown }).code;
  return typeof code === "string" ? code : null;
}

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Validation error",
      issues: error.issues,
    });
    return;
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  const prismaCode = getPrismaErrorCode(error);
  if (prismaCode === "P1001") {
    response.status(503).json({
      message:
        "No se puede conectar con la base de datos. Revisa tu conexión a internet, que el proyecto en Supabase esté activo (los gratuitos se pausan) y que DATABASE_URL / DIRECT_URL en .env sean correctas.",
    });
    return;
  }

  if (prismaCode === "P2022") {
    response.status(500).json({
      message:
        "El esquema de la base de datos no coincide con el que espera Prisma (columna inexistente o distinta). Alinea `prisma/schema.prisma` con las tablas reales en Supabase o aplica las migraciones pendientes con `npx prisma migrate deploy`.",
    });
    return;
  }

  console.error(error);
  response.status(500).json({ message: "Internal server error" });
};
