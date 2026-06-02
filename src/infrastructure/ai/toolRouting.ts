import { isOpenRouterConfigured } from "./openRouterProvider";
import type { AiProviderId } from "./types";

/** Plan mínimo por herramienta (alineado con frontend sidebarCatalog) */
export const TOOL_MIN_PLAN: Record<string, string> = {
  "dev-code-assistant": "free",
  "dev-bug-finder": "basico",
  "dev-sql": "pro",
  "mkt-ads": "basico",
  "mkt-seo": "free",
  "mkt-social": "pro",
  "des-ui": "free",
  "des-brand": "basico",
  "des-image-gen": "basico",
  "biz-strategy": "basico",
  "biz-pitch": "empresarial",
};

/**
 * Tres proveedores para la entrega:
 * - Pollinations → imágenes
 * - OpenRouter → marketing / negocio (texto)
 * - Groq → desarrollo (código)
 */
export function resolveProvider(toolId?: string): AiProviderId {
  const id = (toolId ?? "").toLowerCase();

  if (id === "des-image-gen" || id.includes("image")) {
    return "pollinations";
  }

  if (
    id.startsWith("mkt-") ||
    id.startsWith("biz-") ||
    id.includes("seo") ||
    id.includes("ads") ||
    id.includes("social") ||
    id.includes("marketing") ||
    id.includes("pitch") ||
    id.includes("strategy")
  ) {
    if (isOpenRouterConfigured()) return "openrouter";
    return "groq";
  }

  if (id.startsWith("dev-") || id.includes("code") || id.includes("sql")) {
    return "groq";
  }

  return "groq";
}

export function getToolMinPlan(toolId?: string): string {
  if (!toolId) return "free";
  return TOOL_MIN_PLAN[toolId] ?? "free";
}
