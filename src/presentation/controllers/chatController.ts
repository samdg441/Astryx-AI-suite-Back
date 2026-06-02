import type { Request, Response } from "express";
import { z } from "zod";
import { chatWithAi } from "../../application/use-cases/chatWithAi";
import { resolveProvider } from "../../infrastructure/ai/toolRouting";
import { providerLabel } from "../../infrastructure/ai/aiProviderRegistry";

const chatBody = z.object({
  message: z.string().min(1).max(8000),
  toolId: z.string().min(1).max(64).optional(),
  fileId: z.string().uuid().optional(),
});

export class ChatController {
  async send(request: Request, response: Response) {
    const auth = request.auth;
    if (!auth) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { message, toolId, fileId } = chatBody.parse(request.body);
    const result = await chatWithAi({
      userId: auth.userId,
      userPlan: auth.planType,
      message,
      toolId,
      fileId,
    });

    const provider = resolveProvider(toolId);

    response.status(200).json({
      data: {
        ...result,
        providerLabel: providerLabel(provider),
        toolId: toolId ?? null,
      },
    });
  }
}
