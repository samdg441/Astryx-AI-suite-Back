import { env } from "../../shared/config/env";
import { HttpError } from "../../shared/errors/httpError";
import type { ChatCompletionInput, ChatCompletionResult } from "./types";

const RUN_BASE = "https://api.cloudflare.com/client/v4/accounts";

function endpoint(): string {
  const account = env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const model = env.CLOUDFLARE_IMAGE_MODEL.trim();
  return `${RUN_BASE}/${account}/ai/run/${model}`;
}

export function isCloudflareImageConfigured(): boolean {
  return Boolean(env.CLOUDFLARE_ACCOUNT_ID?.trim() && env.CLOUDFLARE_AI_TOKEN?.trim());
}

type CloudflareImageResponse = {
  result?: { image?: string };
  success?: boolean;
  errors?: { message?: string }[];
};

async function requestImage(prompt: string, timeoutMs: number): Promise<string> {
  const token = env.CLOUDFLARE_AI_TOKEN?.trim();
  if (!isCloudflareImageConfigured()) {
    throw new HttpError(
      503,
      "Generación de imágenes no configurada. Añade CLOUDFLARE_ACCOUNT_ID y CLOUDFLARE_AI_TOKEN (https://dash.cloudflare.com/profile/api-tokens).",
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(endpoint(), {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, steps: 4 }),
    });

    const body = (await res.json()) as CloudflareImageResponse;

    if (!res.ok || body.success === false) {
      const detail = body.errors?.[0]?.message ?? `Cloudflare error HTTP ${res.status}`;
      throw new HttpError(502, detail);
    }

    const image = body.result?.image;
    if (!image) {
      throw new HttpError(502, "Cloudflare no devolvió ninguna imagen");
    }

    return image;
  } finally {
    clearTimeout(timer);
  }
}

export async function completeWithCloudflareImage(
  input: ChatCompletionInput,
): Promise<ChatCompletionResult> {
  const prompt = input.message.trim();
  if (!prompt) {
    throw new HttpError(400, "El prompt de imagen no puede estar vacío");
  }

  const base64 = await requestImage(prompt.slice(0, 2048), 45_000);

  return {
    provider: "cloudflare",
    content: `Imagen generada para: «${prompt.slice(0, 120)}${prompt.length > 120 ? "…" : ""}».`,
    imageUrl: `data:image/jpeg;base64,${base64}`,
  };
}

/** Comprueba que el servicio responde generando una imagen mínima. */
export async function verifyCloudflareImage(timeoutMs = 20_000): Promise<{
  ok: boolean;
  message: string;
  latencyMs: number;
}> {
  if (!isCloudflareImageConfigured()) {
    return {
      ok: false,
      message: "CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_AI_TOKEN no configurados",
      latencyMs: 0,
    };
  }

  const started = Date.now();
  try {
    await requestImage("astryx connectivity test", timeoutMs);
    return {
      ok: true,
      message: `Cloudflare (${env.CLOUDFLARE_IMAGE_MODEL}) respondió correctamente`,
      latencyMs: Date.now() - started,
    };
  } catch (err) {
    const msg = err instanceof HttpError ? err.message : err instanceof Error ? err.message : "Error de red";
    return { ok: false, message: msg, latencyMs: Date.now() - started };
  }
}
