import type { Request, Response } from "express";
import { checkAllAiProviders } from "../../infrastructure/ai/verifyAiProviders";
import { isCloudflareImageConfigured } from "../../infrastructure/ai/cloudflareImageProvider";
import { isGroqConfigured } from "../../infrastructure/ai/groqProvider";
import { isOpenRouterConfigured } from "../../infrastructure/ai/openRouterProvider";

export class AiStatusController {
  async status(_request: Request, response: Response) {
    const providers = await checkAllAiProviders();
    const configured = {
      cloudflare: isCloudflareImageConfigured(),
      openrouter: isOpenRouterConfigured(),
      groq: isGroqConfigured(),
    };

    response.status(200).json({
      data: {
        providers,
        configured,
        routing: {
          images: "cloudflare",
          marketing: isOpenRouterConfigured() ? "openrouter" : "groq (fallback)",
          development: "groq",
        },
        order: ["cloudflare", "openrouter", "groq"],
        hint: "CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_AI_TOKEN para imágenes; OPENROUTER_API_KEY + GROQ_API_KEY para chat.",
      },
    });
  }
}
