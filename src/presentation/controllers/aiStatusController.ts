import type { Request, Response } from "express";
import { checkAllAiProviders } from "../../infrastructure/ai/verifyAiProviders";
import { isGroqConfigured } from "../../infrastructure/ai/groqProvider";
import { isOpenRouterConfigured } from "../../infrastructure/ai/openRouterProvider";

export class AiStatusController {
  async status(_request: Request, response: Response) {
    const providers = await checkAllAiProviders();
    const configured = {
      pollinations: true,
      openrouter: isOpenRouterConfigured(),
      groq: isGroqConfigured(),
    };

    response.status(200).json({
      data: {
        providers,
        configured,
        routing: {
          images: "pollinations",
          marketing: isOpenRouterConfigured() ? "openrouter" : "groq (fallback)",
          development: "groq",
        },
        order: ["pollinations", "openrouter", "groq"],
        hint: "OPENROUTER_API_KEY + GROQ_API_KEY en .env. Pollinations sin key.",
      },
    });
  }
}
