import { randomUUID } from "node:crypto";
import { extractTextFromBuffer } from "../../infrastructure/files/extractFileText";
import {
  deleteFromStorage,
  downloadFromStorage,
  uploadToStorage,
} from "../../infrastructure/storage/supabaseStorageClient";
import type { UserFileRepository } from "../../domain/repositories/userFileRepository";
import { HttpError } from "../../shared/errors/httpError";
import { ALLOWED_FILE_MIMES, getFileLimitsForPlan } from "../../shared/plan/fileLimits";

function sanitizeFileName(name: string): string {
  const base = name.replace(/[/\\?%*:|"<>]/g, "_").trim();
  return base.slice(0, 180) || "archivo";
}

export type UploadUserFileInput = {
  userId: number;
  userPlan: string | null | undefined;
  originalName: string;
  mimeType: string;
  buffer: Buffer;
};

export class UploadUserFile {
  constructor(private readonly repo: UserFileRepository) {}

  async execute(input: UploadUserFileInput) {
    const limits = getFileLimitsForPlan(input.userPlan);
    const mimeType = input.mimeType.split(";")[0]?.trim().toLowerCase() ?? "";

    if (!ALLOWED_FILE_MIMES.has(mimeType)) {
      throw new HttpError(
        400,
        "Tipo no permitido. Usa PDF, TXT, Markdown o CSV.",
      );
    }

    if (input.buffer.length > limits.maxFileBytes) {
      const mb = Math.round(limits.maxFileBytes / (1024 * 1024));
      throw new HttpError(413, `El archivo supera el límite de ${mb} MB de tu plan`);
    }

    const count = await this.repo.countByUser(input.userId);
    if (count >= limits.maxFiles) {
      throw new HttpError(
        403,
        `Has alcanzado el máximo de ${limits.maxFiles} archivos de tu plan. Elimina alguno o mejora tu suscripción.`,
      );
    }

    const fileId = randomUUID();
    const safeName = sanitizeFileName(input.originalName);
    const storagePath = `${input.userId}/${fileId}/${safeName}`;

    await uploadToStorage(storagePath, input.buffer, mimeType);

    try {
      return await this.repo.create({
        userId: input.userId,
        originalName: safeName,
        mimeType,
        sizeBytes: input.buffer.length,
        storagePath,
      });
    } catch (err) {
      await deleteFromStorage(storagePath).catch(() => undefined);
      throw err;
    }
  }
}

export class ListUserFiles {
  constructor(private readonly repo: UserFileRepository) {}

  execute(userId: number) {
    return this.repo.listByUser(userId);
  }
}

export class DeleteUserFile {
  constructor(private readonly repo: UserFileRepository) {}

  async execute(userId: number, fileId: string) {
    const file = await this.repo.findByIdForUser(fileId, userId);
    if (!file) {
      throw new HttpError(404, "Archivo no encontrado");
    }
    await deleteFromStorage(file.storagePath);
    await this.repo.deleteById(file.id);
  }
}

export class GetFileContextForChat {
  constructor(private readonly repo: UserFileRepository) {}

  async execute(userId: number, fileId: string) {
    const file = await this.repo.findByIdForUser(fileId, userId);
    if (!file) {
      throw new HttpError(404, "Archivo no encontrado o no te pertenece");
    }

    const buffer = await downloadFromStorage(file.storagePath);
    const extractedText = await extractTextFromBuffer(buffer, file.mimeType);

    return { file, extractedText };
  }
}
