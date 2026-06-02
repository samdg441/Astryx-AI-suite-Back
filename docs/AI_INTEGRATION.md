# Integración de IAs — Astryx Backend

## Tres proveedores (entrega / variedad)

| Proveedor | Rol | API Key | Herramientas (`toolId`) |
|-----------|-----|---------|-------------------------|
| **Pollinations** | Imágenes | No | `des-image-gen` |
| **OpenRouter** | Marketing, SEO, negocio | `OPENROUTER_API_KEY` | `mkt-*`, `biz-*` |
| **Groq** | Código / desarrollo | `GROQ_API_KEY` | `dev-*` |

Si no hay `OPENROUTER_API_KEY`, marketing usa **Groq** como respaldo.

## Configuración (desarrollador)

1. Crea cuenta en [OpenRouter](https://openrouter.ai) → **Keys** → copia la key.
2. En `.env`:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-...
   OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
   GROQ_API_KEY=gsk_...
   ```
3. Verifica:
   ```bash
   npm run ai:verify
   ```

Modelos gratis en OpenRouter: [openrouter.ai/models](https://openrouter.ai/models) — filtra por `:free`.

## Endpoints

- `GET /api/v1/ai/status`
- `POST /api/v1/chat` — `{ "message": "...", "toolId": "mkt-seo" }`
