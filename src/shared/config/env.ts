import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default("/api/v1"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1).optional(),
  /** URL del frontend (éxito / cancelación de Checkout) */
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_BASICO: z.string().min(1).optional(),
  STRIPE_PRICE_PRO: z.string().min(1).optional(),
  STRIPE_PRICE_EMPRESARIAL: z.string().min(1).optional(),
  /** true = permite POST /subscription/mock-activate (solo demos; false en producción) */
  MOCK_CHECKOUT_ENABLED: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1")
    .pipe(z.boolean())
    .default(false),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  /** OpenRouter — marketing / SEO (https://openrouter.ai/keys) */
  OPENROUTER_API_KEY: z.string().min(1).optional(),
  /** Modelo OpenRouter (ej. meta-llama/llama-3.1-8b-instruct:free) */
  OPENROUTER_MODEL: z.string().min(1).default("meta-llama/llama-3.1-8b-instruct:free"),
  /** Groq — asistente de código */
  GROQ_API_KEY: z.string().min(1).optional(),
  /** Supabase project URL (https://xxxx.supabase.co) — Storage para archivos de usuario */
  SUPABASE_URL: z.string().url().optional(),
  /** Service role key (solo backend; nunca en el frontend) */
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  /** Bucket privado en Supabase Storage */
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("user-files"),
});

export const env = envSchema.parse(process.env);
