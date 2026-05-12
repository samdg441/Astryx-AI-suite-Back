-- Opción si prefieres pegar datos directo en Supabase (sin Prisma seed).
-- Borra antes si ya tienes filas y quieres evitar duplicados:
-- TRUNCATE public.ias RESTART IDENTITY CASCADE;

INSERT INTO public.ias (nombre, proveedor, descripcion, categoria, url_api, plan_minimo, activa)
VALUES
  ('Gemini API', 'Google',
   'Modelos multimodales: texto, código y visión. Cuota gratuita en AI Studio.',
   'texto', 'https://ai.google.dev/gemini-api/docs', 'free', TRUE),
  ('Groq OpenAI-compatible', 'Groq',
   'Chat y código muy rápido; API compatible con OpenAI; tier gratuito para pruebas.',
   'codigo', 'https://console.groq.com/docs/api-reference', 'free', TRUE),
  ('Hugging Face Inference', 'Hugging Face',
   'Imágenes (Stable Diffusion, Flux) y texto con modelos abiertos; límites en tier gratis.',
   'imagen', 'https://huggingface.co/docs/api-inference/index', 'free', TRUE),
  ('Replicate', 'Replicate',
   'REST para imagen y video con muchos modelos; créditos al registrarte.',
   'video', 'https://replicate.com/docs/reference/http', 'basico', TRUE),
  ('Gamma', 'Gamma',
   'Presentaciones desde texto; ideal para diapositivas (uso principalmente web).',
   'presentaciones', 'https://gamma.app', 'basico', TRUE),
  ('Together.ai', 'Together AI',
   'API tipo OpenAI para modelos abiertos; créditos gratuitos al iniciar.',
   'codigo', 'https://docs.together.ai/reference', 'free', TRUE),
  ('ElevenLabs', 'ElevenLabs',
   'Voz sintética; tier gratuito mensual limitado.',
   'audio', 'https://elevenlabs.io/docs/api-reference/overview', 'basico', TRUE),
  ('Remove.bg API', 'Kaleido AI',
   'Quitar fondo de una imagen con una petición HTTP sencilla.',
   'imagen', 'https://www.remove.bg/api', 'free', TRUE),
  ('OpenAI API', 'OpenAI',
   'GPT para texto y asistente de código; documentación oficial.',
   'texto', 'https://platform.openai.com/docs/api-reference', 'pro', TRUE),
  ('Anthropic Messages API', 'Anthropic',
   'Claude para texto largo y código.',
   'texto', 'https://docs.anthropic.com/en/api/getting-started', 'pro', TRUE);
