import type { SubscriptionPlan } from "../../domain/entities/subscriptionPlan";

const now = new Date("2026-01-01T00:00:00.000Z");

export const ACTIVE_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Gratuito",
    description: "Herramientas free y chat con límites básicos",
    monthlyPrice: 0,
    userLimit: 1,
    status: "activo",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: "Básico",
    description: "Más herramientas y mayor límite de archivos",
    monthlyPrice: 19,
    userLimit: 3,
    status: "activo",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: "Pro",
    description: "IAs premium y contexto extendido",
    monthlyPrice: 49,
    userLimit: 10,
    status: "activo",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    name: "Empresarial",
    description: "Equipos y soporte prioritario",
    monthlyPrice: 99,
    userLimit: 50,
    status: "activo",
    createdAt: now,
    updatedAt: now,
  },
];
