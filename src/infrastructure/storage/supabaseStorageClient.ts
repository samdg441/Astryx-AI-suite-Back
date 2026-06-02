import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../../shared/config/env";
import { HttpError } from "../../shared/errors/httpError";

let client: SupabaseClient | null = null;

export function isStorageConfigured(): boolean {
  return Boolean(env.SUPABASE_URL?.trim() && env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

function getClient(): SupabaseClient {
  if (!isStorageConfigured()) {
    throw new HttpError(
      503,
      "Almacenamiento de archivos no configurado. Añade SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el servidor.",
    );
  }
  if (!client) {
    client = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export async function uploadToStorage(
  storagePath: string,
  buffer: Buffer,
  mimeType: string,
): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new HttpError(502, `Error al subir archivo: ${error.message}`);
  }
}

export async function downloadFromStorage(storagePath: string): Promise<Buffer> {
  const supabase = getClient();
  const { data, error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .download(storagePath);

  if (error || !data) {
    throw new HttpError(404, "Archivo no encontrado en almacenamiento");
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function deleteFromStorage(storagePath: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new HttpError(502, `Error al eliminar archivo: ${error.message}`);
  }
}
