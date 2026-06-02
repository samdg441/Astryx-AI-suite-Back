# Archivos de usuario (Supabase Storage)

Los PDF/TXT del dashboard se guardan en un **bucket privado** de Supabase. El backend sube y descarga con la **service role key**; el frontend nunca ve esa clave.

## Cómo funciona (flujo)

```
Usuario → sube PDF en panel Contexto
       → POST /api/v1/files (multipart, JWT)
       → Backend valida plan/tamaño/tipo
       → Sube bytes a Supabase Storage (bucket user-files)
       → Guarda metadatos en tabla archivos_usuario (PostgreSQL)

Usuario → selecciona archivo + escribe pregunta
       → POST /api/v1/chat { message, fileId }
       → Backend descarga el PDF del bucket
       → Extrae texto (pdf-parse)
       → Inyecta el texto en el prompt → Groq/OpenRouter responde
```

## Paso 1 — Crear bucket en Supabase

1. Entra en [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto.
2. **Storage** → **New bucket**.
3. Nombre: `user-files`.
4. **Public bucket: OFF** (privado).
5. Crear.

No hace falta policy pública: el backend usa la service role y bypass RLS.

## Paso 2 — Variables en el backend

En `.env` local y en Render:

| Variable | Dónde obtenerla |
|----------|-----------------|
| `SUPABASE_URL` | Settings → API → Project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → `service_role` (secret) |
| `SUPABASE_STORAGE_BUCKET` | `user-files` (o el nombre que hayas puesto) |

**Nunca** pongas la service role en el frontend ni la commitees.

## Paso 3 — Migración de base de datos

```bash
npm run prisma:generate
npx prisma migrate deploy
```

Crea la tabla `archivos_usuario`.

## Paso 4 — Probar

```bash
npm run dev
```

1. Login en el dashboard.
2. Panel **Contexto** → sube un PDF.
3. Selecciónalo y pregunta: *"Resume este documento en 3 puntos"*.
4. La IA debe responder usando el contenido del PDF.

## Límites por plan

| Plan | Tamaño máx. archivo | Máx. archivos |
|------|---------------------|---------------|
| free | 5 MB | 5 |
| basico | 10 MB | 20 |
| pro | 20 MB | 50 |
| empresarial | 50 MB | 100 |

Tipos: PDF, TXT, Markdown, CSV.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/files` | Subir (`multipart/form-data`, campo `file`) |
| GET | `/api/v1/files` | Listar mis archivos |
| DELETE | `/api/v1/files/:id` | Borrar (Storage + BD) |
| POST | `/api/v1/chat` | `{ message, fileId?, toolId? }` |
