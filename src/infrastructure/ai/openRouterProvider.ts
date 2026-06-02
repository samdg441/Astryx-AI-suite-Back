import { env } from "../../shared/config/env";
import { HttpError } from "../../shared/errors/httpError";
import type { ChatCompletionInput, ChatCompletionResult } from "./types";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

function systemPromptForTool(toolId?: string): string {
  const base =
    "Eres un asistente de Astryx AI Suite. Responde en español, de forma clara y orientada a resultados.";
  if (!toolId) return base;
  if (toolId.startsWith("mkt-")) {
    return `${base} Especialista en marketing digital, SEO, copy y redes. Usa bullets y CTAs cuando ayude.`;
  }
  if (toolId.startsWith("biz-")) {
    return `${base} Consultor de negocio y estrategia para startups.`;
  }
  return base;
}

export function isOpenRouterConfigured(): boolean {
  return Boolean(env.OPENROUTER_API_KEY?.trim());
}

type OpenRouterResponse = {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
};

export async function completeWithOpenRouter(
  input: ChatCompletionInput,
): Promise<ChatCompletionResult> {
  const apiKey = env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new HttpError(
      503,
      "OpenRouter no configurado. Añade OPENROUTER_API_KEY (https://openrouter.ai/keys).",
    );
  }

  const model = env.OPENROUTER_MODEL.trim();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.FRONTEND_URL,
      "X-Title": "Astryx AI Suite",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 2048,
      messages: [
        { role: "system", content: systemPromptForTool(input.toolId) },
        { role: "user", content: input.message },
      ],
    }),
  });

  const body = (await res.json()) as OpenRouterResponse;

  if (!res.ok) {
    throw new HttpError(502, body.error?.message ?? `OpenRouter error HTTP ${res.status}`);
  }

  const text = body.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new HttpError(502, "OpenRouter no devolvió texto");
  }

  return { provider: "openrouter", content: text };
}

export async function verifyOpenRouter(timeoutMs = 20_000): Promise<{
  ok: boolean;
  message: string;
  latencyMs: number;
}> {
  if (!isOpenRouterConfigured()) {
    return { ok: false, message: "OPENROUTER_API_KEY no configurada", latencyMs: 0 };
  }

  const started = Date.now();
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout OpenRouter")), timeoutMs),
    );
    await Promise.race([
      completeWithOpenRouter({ message: "Responde solo: OK", toolId: "mkt-seo" }),
      timeout,
    ]);
    return {
      ok: true,
      message: `OpenRouter (${env.OPENROUTER_MODEL}) respondió`,
      latencyMs: Date.now() - started,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Error OpenRouter",
      latencyMs: Date.now() - started,
    };
  }
}
