import { verifyGroq, isGroqConfigured } from "./groqProvider";
import { verifyOpenRouter, isOpenRouterConfigured } from "./openRouterProvider";
import { verifyPollinations } from "./pollinationsProvider";
import type { AiProviderCheck } from "./types";

export async function checkAllAiProviders(): Promise<AiProviderCheck[]> {
  const [pollinations, openrouter, groq] = await Promise.all([
    (async (): Promise<AiProviderCheck> => {
      const r = await verifyPollinations();
      return {
        provider: "pollinations",
        status: r.ok ? "ok" : "error",
        message: r.message,
        latencyMs: r.latencyMs,
      };
    })(),
    (async (): Promise<AiProviderCheck> => {
      if (!isOpenRouterConfigured()) {
        return {
          provider: "openrouter",
          status: "not_configured",
          message: "OPENROUTER_API_KEY no configurada (marketing usará Groq como respaldo)",
        };
      }
      const r = await verifyOpenRouter();
      return {
        provider: "openrouter",
        status: r.ok ? "ok" : "error",
        message: r.message,
        latencyMs: r.latencyMs,
      };
    })(),
    (async (): Promise<AiProviderCheck> => {
      if (!isGroqConfigured()) {
        return {
          provider: "groq",
          status: "not_configured",
          message: "GROQ_API_KEY no configurada",
        };
      }
      const r = await verifyGroq();
      return {
        provider: "groq",
        status: r.ok ? "ok" : "error",
        message: r.message,
        latencyMs: r.latencyMs,
      };
    })(),
  ]);

  return [pollinations, openrouter, groq];
}

/** Logs al arrancar el servidor. */
export async function logAiProvidersOnStartup(): Promise<void> {
  console.log("\n[Astryx AI] Verificando proveedores (Pollinations → OpenRouter → Groq)…\n");

  const checks = await checkAllAiProviders();

  for (const c of checks) {
    const icon =
      c.status === "ok" ? "✓" : c.status === "not_configured" ? "○" : "✗";
    const ms = c.latencyMs != null ? ` (${c.latencyMs}ms)` : "";
    console.log(`  ${icon} ${c.provider.padEnd(14)} ${c.status.padEnd(16)} ${c.message}${ms}`);
  }

  console.log("\n  Endpoint: GET /api/v1/ai/status");
  console.log("  Chat:     POST /api/v1/chat (JWT)\n");
}
