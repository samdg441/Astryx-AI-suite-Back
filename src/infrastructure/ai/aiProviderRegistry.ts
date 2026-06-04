import { HttpError } from "../../shared/errors/httpError";
import { completeWithGroq } from "./groqProvider";
import { completeWithOpenRouter, isOpenRouterConfigured } from "./openRouterProvider";
import { completeWithCloudflareImage } from "./cloudflareImageProvider";
import { resolveProvider } from "./toolRouting";
import type { ChatCompletionInput, ChatCompletionResult, AiProviderId } from "./types";

export async function completeChat(input: ChatCompletionInput): Promise<ChatCompletionResult> {
  const provider = resolveProvider(input.toolId);

  switch (provider) {
    case "cloudflare":
      return completeWithCloudflareImage(input);
    case "openrouter":
      try {
        return await completeWithOpenRouter(input);
      } catch (err) {
        if (!isOpenRouterConfigured()) throw err;
        const fallback = await completeWithGroq(input);
        return {
          ...fallback,
          content: `Groq (respaldo OpenRouter)\n\n${fallback.content}`,
        };
      }
    case "groq":
      return completeWithGroq(input);
    default: {
      const _exhaustive: never = provider;
      throw new HttpError(500, `Proveedor no soportado: ${String(_exhaustive)}`);
    }
  }
}

export function providerLabel(id: AiProviderId): string {
  if (id === "cloudflare") return "Cloudflare Workers AI (imágenes)";
  if (id === "openrouter") return "OpenRouter";
  return "Groq";
}
