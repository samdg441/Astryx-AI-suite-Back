import { env } from "../../shared/config/env";
import { HttpError } from "../../shared/errors/httpError";
import type { ChatCompletionInput, ChatCompletionResult } from "./types";

const MODEL = "llama-3.1-8b-instant";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

function systemPromptForTool(toolId?: string): string {
  const base =
    "Eres el asistente de desarrollo de Astryx AI Suite. Responde en español; incluye código cuando sea útil.";
  if (!toolId) return base;
  if (toolId.startsWith("dev-")) {
    return `${base} Prioriza buenas prácticas, TypeScript y APIs REST.`;
  }
  return base;
}

export function isGroqConfigured(): boolean {
  return Boolean(env.GROQ_API_KEY?.trim());
}

type GroqResponse = {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
};

export async function completeWithGroq(input: ChatCompletionInput): Promise<ChatCompletionResult> {
  const apiKey = env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new HttpError(503, "Groq no configurado. Añade GROQ_API_KEY en el servidor.");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.6,
      max_tokens: 2048,
      messages: [
        { role: "system", content: systemPromptForTool(input.toolId) },
        { role: "user", content: input.message },
      ],
    }),
  });

  const body = (await res.json()) as GroqResponse;

  if (!res.ok) {
    throw new HttpError(502, body.error?.message ?? `Groq error HTTP ${res.status}`);
  }

  const text = body.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new HttpError(502, "Groq no devolvió texto");
  }

  return { provider: "groq", content: text };
}

const IMAGE_PROMPT_SYSTEM =
  "You are a prompt engineer for the FLUX text-to-image model. Rewrite the user's request into a single, vivid, detailed image prompt IN ENGLISH. Describe subject, setting, style, lighting and composition, and add quality keywords (highly detailed, sharp focus, professional, high quality). Output ONLY the final prompt: no quotes, no explanations, no line breaks, max 70 words.";

/**
 * Mejora y traduce a inglés un prompt de imagen usando Groq.
 * Si Groq no está configurado o falla, devuelve el prompt original (no rompe la generación).
 */
export async function enhanceImagePrompt(userPrompt: string, timeoutMs = 12_000): Promise<string> {
  const apiKey = env.GROQ_API_KEY?.trim();
  if (!apiKey) return userPrompt;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 200,
        messages: [
          { role: "system", content: IMAGE_PROMPT_SYSTEM },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) return userPrompt;
    const body = (await res.json()) as GroqResponse;
    const enhanced = body.choices?.[0]?.message?.content?.trim();
    return enhanced && enhanced.length > 0 ? enhanced : userPrompt;
  } catch {
    return userPrompt;
  } finally {
    clearTimeout(timer);
  }
}

export async function verifyGroq(timeoutMs = 15_000): Promise<{
  ok: boolean;
  message: string;
  latencyMs: number;
}> {
  if (!isGroqConfigured()) {
    return { ok: false, message: "GROQ_API_KEY no configurada", latencyMs: 0 };
  }

  const started = Date.now();
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout Groq")), timeoutMs),
    );
    await Promise.race([
      completeWithGroq({ message: "Responde solo: OK", toolId: "dev-code-assistant" }),
      timeout,
    ]);
    return {
      ok: true,
      message: `Groq (${MODEL}) respondió`,
      latencyMs: Date.now() - started,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Error Groq",
      latencyMs: Date.now() - started,
    };
  }
}
