import { PDFParse } from "pdf-parse";
import { HttpError } from "../../shared/errors/httpError";
import { ALLOWED_FILE_MIMES, MAX_EXTRACTED_TEXT_CHARS } from "../../shared/plan/fileLimits";

function truncateText(text: string): string {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (normalized.length <= MAX_EXTRACTED_TEXT_CHARS) {
    return normalized;
  }
  return `${normalized.slice(0, MAX_EXTRACTED_TEXT_CHARS)}\n\n[… texto truncado por límite de contexto …]`;
}

export async function extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
  if (!ALLOWED_FILE_MIMES.has(mimeType)) {
    throw new HttpError(400, "Tipo de archivo no soportado para análisis con IA");
  }

  if (mimeType === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      const text = result.text?.trim();
      if (!text) {
        throw new HttpError(422, "No se pudo extraer texto del PDF (¿escaneado sin OCR?)");
      }
      return truncateText(text);
    } finally {
      await parser.destroy();
    }
  }

  const text = buffer.toString("utf-8").trim();
  if (!text) {
    throw new HttpError(422, "El archivo de texto está vacío");
  }
  return truncateText(text);
}
