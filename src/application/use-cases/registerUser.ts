import bcrypt from "bcrypt";
import { prisma } from "../../infrastructure/database/prismaClient";
import { HttpError } from "../../shared/errors/httpError";

export type AccountKind = "PERSONA" | "EMPRESA";

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  accountKind: AccountKind;
  /** Obligatorio si accountKind === EMPRESA */
  companyName?: string | null;
};

export type RegisterUserResult = {
  id: number;
  name: string;
  email: string;
  globalRole: string;
  planType: string | null;
  subscriptionStatus: string;
};

/**
 * La tabla `usuarios` no tiene columnas separadas de empresa.
 * Para cuentas EMPRESA guardamos en `nombre`: "Empresa — Persona de contacto".
 */
function buildStoredName(input: RegisterUserInput): string {
  const person = input.name.trim();
  if (input.accountKind === "EMPRESA") {
    const company = input.companyName?.trim();
    if (!company || company.length < 2) {
      throw new HttpError(400, "Indica el nombre de la empresa (mínimo 2 caracteres).");
    }
    return `${company} — ${person}`;
  }
  return person;
}

const ROL_GLOBAL_REGISTRO = "usuario";

function mapRegisterConstraintError(message: string): HttpError | null {
  if (message.includes("usuarios_rol_global_chk") || message.includes("rol_global")) {
    return new HttpError(
      400,
      "rol_global no cumple el CHECK de la base de datos (solo admin y usuario en minúsculas).",
    );
  }
  if (message.includes("usuarios_tipo_plan_chk") || message.includes("tipo_plan")) {
    return new HttpError(400, "tipo_plan no cumple el CHECK de la base de datos.");
  }
  if (message.includes("usuarios_estado_suscripcion_chk") || message.includes("estado_suscripcion")) {
    return new HttpError(400, "estado_suscripcion no cumple el CHECK de la base de datos.");
  }
  return null;
}

export async function registerUser(input: RegisterUserInput): Promise<RegisterUserResult> {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, "Email already registered");
  }

  const storedName = buildStoredName(input);
  const passwordHash = await bcrypt.hash(input.password, 12);
  const globalRole = ROL_GLOBAL_REGISTRO;

  try {
    const user = await prisma.user.create({
      data: {
        name: storedName,
        email,
        passwordHash,
        globalRole,
        isActive: true,
        planType: null,
        subscriptionStatus: "inactivo",
      },
      select: {
        id: true,
        name: true,
        email: true,
        globalRole: true,
        planType: true,
        subscriptionStatus: true,
      },
    });

    return user;
  } catch (err: unknown) {
    const text = err instanceof Error ? err.message : String(err);
    const mapped = mapRegisterConstraintError(text);
    if (mapped) {
      throw mapped;
    }
    throw err;
  }
}
