import { HttpError } from "../../shared/errors/httpError";
import { completeWithGroq } from "./groqProvider";
import { completeWithOpenRouter, isOpenRouterConfigured } from "./openRouterProvider";
import { completeWithPollinations } from "./pollinationsProvider";
import { resolveProvider } from "./toolRouting";
import type { ChatCompletionInput, ChatCompletionResult, AiProviderId } from "./types";

export async function completeChat(input: ChatCompletionInput): Promise<ChatCompletionResult> {
  const provider = resolveProvider(input.toolId);

  switch (provider) {
    case "pollinations":
      return completeWithPollinations(input);
    case "openrouter":
      try {
        return await completeWithOpenRouter(input);
      } catch (err) {
        if (!isOpenRouterConfigured()) throw err;
        const fallback = await completeWithGroq(input);
        return {
          ...fallback,
          content: `[OpenRouter no disponible — respuesta vía Groq]\n\n${fallback.content}`,
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
  if (id === "pollinations") return "Pollinations (imágenes)";
  if (id === "openrouter") return "OpenRouter";
  return "Groq";
}
