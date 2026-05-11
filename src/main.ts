import { createApp } from "./app";
import { prisma } from "./infrastructure/database/prismaClient";
import { env } from "./shared/config/env";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Astryx API running on http://localhost:${env.PORT}${env.API_PREFIX}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
