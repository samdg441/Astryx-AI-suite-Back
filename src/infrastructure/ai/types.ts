/** Proveedores de inferencia soportados por Astryx */
export type AiProviderId = "pollinations" | "openrouter" | "groq";

export type ChatCompletionInput = {
  message: string;
  toolId?: string;
};

export type ChatCompletionResult = {
  provider: AiProviderId;
  content: string;
  imageUrl?: string;
};

export type AiProviderStatus = "ok" | "not_configured" | "error";

export type AiProviderCheck = {
  provider: AiProviderId;
  status: AiProviderStatus;
  message: string;
  latencyMs?: number;
};
