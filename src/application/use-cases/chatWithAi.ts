import { completeChat } from "../../infrastructure/ai/aiProviderRegistry";
import { getToolMinPlan, resolveProvider } from "../../infrastructure/ai/toolRouting";
import type { ChatCompletionResult } from "../../infrastructure/ai/types";
import { GetFileContextForChat } from "./userFiles";
import { userFileRepository } from "../../infrastructure/repositories/prismaUserFileRepository";
import { canAccessPlan } from "../../shared/plan/planAccess";
import { HttpError } from "../../shared/errors/httpError";

const getFileContext = new GetFileContextForChat(userFileRepository);

export type ChatWithAiInput = {
  userId: number;
  userPlan: string | null | undefined;
  message: string;
  toolId?: string;
  fileId?: string;
};

export async function chatWithAi(input: ChatWithAiInput): Promise<ChatCompletionResult> {
  const message = input.message.trim();
  if (!message) {
    throw new HttpError(400, "El mensaje no puede estar vacío");
  }

  const minPlan = getToolMinPlan(input.toolId);
  if (!canAccessPlan(input.userPlan, minPlan)) {
    throw new HttpError(
      403,
      `Esta herramienta requiere plan ${minPlan} o superior. Mejora tu suscripción en Planes.`,
    );
  }

  resolveProvider(input.toolId);

  let prompt = message;
  if (input.fileId) {
    const { file, extractedText } = await getFileContext.execute(input.userId, input.fileId);
    prompt = [
      `El usuario adjuntó el documento "${file.originalName}".`,
      "Usa el contenido siguiente para responder con precisión.",
      "",
      "--- CONTENIDO DEL DOCUMENTO ---",
      extractedText,
      "--- FIN DEL DOCUMENTO ---",
      "",
      "Pregunta o instrucción del usuario:",
      message,
    ].join("\n");
  }

  return completeChat({
    message: prompt,
    toolId: input.toolId,
  });
}
