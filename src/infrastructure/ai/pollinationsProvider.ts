import { HttpError } from "../../shared/errors/httpError";
import type { ChatCompletionInput, ChatCompletionResult } from "./types";

const BASE = "https://image.pollinations.ai/prompt";

export function buildPollinationsImageUrl(prompt: string): string {
  const encoded = encodeURIComponent(prompt.trim().slice(0, 500));
  return `${BASE}/${encoded}?width=1024&height=1024&nologo=true`;
}

export async function completeWithPollinations(
  input: ChatCompletionInput,
): Promise<ChatCompletionResult> {
  const prompt = input.message.trim();
  if (!prompt) {
    throw new HttpError(400, "El prompt de imagen no puede estar vacío");
  }

  const imageUrl = buildPollinationsImageUrl(prompt);

  return {
    provider: "pollinations",
    content: `Imagen generada para: «${prompt.slice(0, 120)}${prompt.length > 120 ? "…" : ""}».`,
    imageUrl,
  };
}

/** Comprueba que el servicio responde (HEAD/GET ligero). */
export async function verifyPollinations(timeoutMs = 12_000): Promise<{
  ok: boolean;
  message: string;
  latencyMs: number;
}> {
  const started = Date.now();
  const testUrl = buildPollinationsImageUrl("astryx connectivity test");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(testUrl, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "image/*" },
    });
    const latencyMs = Date.now() - started;
    if (res.ok || res.status === 302) {
      return { ok: true, message: "Pollinations respondió correctamente", latencyMs };
    }
    return {
      ok: false,
      message: `Pollinations HTTP ${res.status}`,
      latencyMs,
    };
  } catch (err) {
    const latencyMs = Date.now() - started;
    const msg = err instanceof Error ? err.message : "Error de red";
    return { ok: false, message: msg, latencyMs };
  } finally {
    clearTimeout(timer);
  }
}
