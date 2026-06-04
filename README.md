# Astryx AI Suite — Backend

API REST en Node.js, Express, Prisma y PostgreSQL (Supabase).  
Frontend: [Astryx-AI-suite](https://github.com/samdg441/Astryx-AI-suite)

## Inicio rápido

```bash
npm install
cp .env.example .env
npm run prisma:generate
npx prisma migrate deploy
npm run dev
```

API local: `http://localhost:4000/api/v1`  
Comprobar: `GET /api/v1/health`

## Variables de entorno

Ver `.env.example`. Mínimo: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CORS_ORIGIN`.  
Chat: `GROQ_API_KEY`. Archivos PDF: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`.

## Estructura

```
src/
  domain/          entidades e interfaces
  application/     casos de uso
  infrastructure/  prisma, storage, IAs
  presentation/    rutas y controladores
  shared/          env, auth, errores HTTP
```

## Endpoints (`/api/v1`)

| Recurso | Métodos | Auth |
|---------|---------|------|
| `/auth/register`, `/auth/login` | POST | — |
| `/tools` | GET, POST, PUT, DELETE | admin en mutaciones |
| `/contact-leads` | GET, POST, PUT, DELETE | POST público; resto admin |
| `/users` | GET (paginado) | admin |
| `/user/me`, `/chat`, `/files` | GET/POST | JWT |
| `/health`, `/plans`, `/ai/status` | GET | — |

Listados paginados: `?page=1&limit=10` → `{ data, meta }`.  
Filtros en `/tools` y `/contact-leads` (ver controladores).

JWT: `Authorization: Bearer <token>`. Rol `admin` en rutas de administración.

## IAs (chat)

| Proveedor | Uso | Variable |
|-----------|-----|----------|
| Groq | código (`dev-*`) | `GROQ_API_KEY` |
| OpenRouter | marketing (`mkt-*`, `biz-*`) | `OPENROUTER_API_KEY` (opcional) |
| Cloudflare Workers AI | imágenes (`des-image-gen`) | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_AI_TOKEN` |

`npm run ai:verify` comprueba conectividad.

## Archivos

Bucket privado `user-files` en Supabase Storage.  
`POST /files` (multipart), `GET /files`, `DELETE /files/:id`.  
En chat: `{ "message": "...", "fileId": "uuid" }` — el servidor extrae texto del PDF/TXT.

## Scripts

```bash
npm run dev
npm run build && npm start
npm test
npm run prisma:seed
npm run prisma:seed-admin
```

## Despliegue (Render)

- Build: `npm install && npm run build`
- Start: `npm start`
- Demo: https://astryx-ai-suite-back.onrender.com/api/v1/health

Admin en BD:

```sql
UPDATE usuarios SET rol_global = 'admin' WHERE correo = 'tu@email.com';
```
