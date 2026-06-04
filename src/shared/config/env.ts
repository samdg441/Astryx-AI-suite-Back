import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default("/api/v1"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1).optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_BASICO: z.string().min(1).optional(),
  STRIPE_PRICE_PRO: z.string().min(1).optional(),
  STRIPE_PRICE_EMPRESARIAL: z.string().min(1).optional(),
  MOCK_CHECKOUT_ENABLED: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1")
    .pipe(z.boolean())
    .default(false),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  OPENROUTER_API_KEY: z.string().min(1).optional(),
  OPENROUTER_MODEL: z.string().min(1).default("meta-llama/llama-3.1-8b-instruct:free"),
  GROQ_API_KEY: z.string().min(1).optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1).optional(),
  CLOUDFLARE_AI_TOKEN: z.string().min(1).optional(),
  CLOUDFLARE_IMAGE_MODEL: z.string().min(1).default("@cf/black-forest-labs/flux-1-schnell"),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("user-files"),
});

export const env = envSchema.parse(process.env);
