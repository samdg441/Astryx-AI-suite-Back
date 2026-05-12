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

  await prisma.aiTool.createMany({
    data: [
      {
        name: "ChatGPT",
        provider: "OpenAI",
        description: "Asistente conversacional para productividad, investigacion y creacion de contenido.",
        category: "productividad",
        urlApi: null,
        requiredPlan: "pro",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Claude",
        provider: "Anthropic",
        description: "Modelo de IA orientado a analisis, escritura y razonamiento avanzado.",
        category: "productividad",
        urlApi: null,
        requiredPlan: "free",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Midjourney",
        provider: "Midjourney",
        description: "Generacion de imagenes creativas para branding, campanas y prototipos visuales.",
        category: "creatividad",
        urlApi: null,
        requiredPlan: "empresarial",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
  });

  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: "Starter",
        description: "Plan inicial para explorar herramientas IA desde una sola plataforma.",
        monthlyPrice: 19,
        userLimit: 1,
        status: "activo",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Pro",
        description: "Plan para equipos pequenos que necesitan mayor capacidad y soporte.",
        monthlyPrice: 49,
        userLimit: 10,
        status: "activo",
        createdAt: now,
        updatedAt: now,
      },
    ],
  });
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
