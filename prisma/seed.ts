import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const now = new Date();

  /** Vacía `ias` para poder re-ejecutar la semilla sin duplicar filas. */
  const deleted = await prisma.aiTool.deleteMany({});
  console.log(`Filas eliminadas en ias: ${deleted.count}`);

  await prisma.aiTool.createMany({
    data: [
      {
        name: "Gemini API",
        provider: "Google",
        description:
          "Modelos multimodales: texto, codigo, vision y resumen de documentos. Buena documentacion y cuota gratuita en AI Studio.",
        category: "texto",
        urlApi: "https://ai.google.dev/gemini-api/docs",
        requiredPlan: "free",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Groq OpenAI-compatible",
        provider: "Groq",
        description:
          "Inferencia muy rapida para chat y codigo (Llama, Mixtral). API compatible con OpenAI; tier gratuito para pruebas.",
        category: "codigo",
        urlApi: "https://console.groq.com/docs/api-reference",
        requiredPlan: "free",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Hugging Face Inference",
        provider: "Hugging Face",
        description:
          "API para imagenes (Stable Diffusion, Flux), texto y mas modelos abiertos. Tier gratuito con limites de velocidad.",
        category: "imagen",
        urlApi: "https://huggingface.co/docs/api-inference/index",
        requiredPlan: "free",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Replicate",
        provider: "Replicate",
        description:
          "Varios modelos en API REST: imagen, video corto, upscaling. Creditos al registrarte; facil de llamar desde backend.",
        category: "video",
        urlApi: "https://replicate.com/docs/reference/http",
        requiredPlan: "basico",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Gamma",
        provider: "Gamma",
        description:
          "Presentaciones y paginas generadas desde texto; export y enlaces. Ideal para diapositivas rapidas (uso principalmente web).",
        category: "presentaciones",
        urlApi: "https://gamma.app",
        requiredPlan: "basico",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Together.ai",
        provider: "Together AI",
        description:
          "API tipo OpenAI para modelos abiertos; util para codigo y texto con creditos gratuitos al iniciar.",
        category: "codigo",
        urlApi: "https://docs.together.ai/reference",
        requiredPlan: "free",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "ElevenLabs",
        provider: "ElevenLabs",
        description:
          "Sintesis de voz y clones limitados; tier gratuito mensual acotado. Bueno para narracion de videos o accesibilidad.",
        category: "audio",
        urlApi: "https://elevenlabs.io/docs/api-reference/overview",
        requiredPlan: "basico",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "OpenAI API",
        provider: "OpenAI",
        description:
          "GPT para texto y Codex-asistente; requiere cuenta y facturacion pero muy documentado para integrar.",
        category: "texto",
        urlApi: "https://platform.openai.com/docs/api-reference",
        requiredPlan: "pro",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Anthropic Messages API",
        provider: "Anthropic",
        description:
          "Claude para texto largo y codigo; panel de desarrollo con saldo inicial segun epoca.",
        category: "texto",
        urlApi: "https://docs.anthropic.com/en/api/getting-started",
        requiredPlan: "pro",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Remove.bg API",
        provider: "Kaleido AI",
        description:
          "Elimina fondo de imagenes con una llamada HTTP simple; creditos gratuitos limitados al registrarte.",
        category: "imagen",
        urlApi: "https://www.remove.bg/api",
        requiredPlan: "free",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
  });

  const total = await prisma.aiTool.count();
  console.log(`Seed OK: ${total} herramientas IA en tabla ias (plan_minimo cumple CHECK).`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
