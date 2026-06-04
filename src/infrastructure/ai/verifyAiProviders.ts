import { verifyCloudflareImage, isCloudflareImageConfigured } from "./cloudflareImageProvider";
import { verifyGroq, isGroqConfigured } from "./groqProvider";
import { verifyOpenRouter, isOpenRouterConfigured } from "./openRouterProvider";
import type { AiProviderCheck } from "./types";

export async function checkAllAiProviders(): Promise<AiProviderCheck[]> {
  const [cloudflare, openrouter, groq] = await Promise.all([
    (async (): Promise<AiProviderCheck> => {
      if (!isCloudflareImageConfigured()) {
        return {
          provider: "cloudflare",
          status: "not_configured",
          message: "CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_AI_TOKEN no configurados",
        };
      }
      const r = await verifyCloudflareImage();
      return {
        provider: "cloudflare",
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

  return [cloudflare, openrouter, groq];
}

/** Logs al arrancar el servidor. */
export async function logAiProvidersOnStartup(): Promise<void> {
  console.log("\n[Astryx AI] Verificando proveedores (Cloudflare → OpenRouter → Groq)…\n");

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
