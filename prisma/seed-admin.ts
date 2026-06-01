import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = process.env["ADMIN_SEED_EMAIL"] ?? "admin@gmail.com";
const ADMIN_NAME = process.env["ADMIN_SEED_NAME"] ?? "Samuel";
const ADMIN_PASSWORD = process.env["ADMIN_SEED_PASSWORD"] ?? "123456789";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      globalRole: "admin",
      planType: "free",
      subscriptionStatus: "activo",
      isActive: true,
    },
    update: {
      name: ADMIN_NAME,
      passwordHash,
      globalRole: "admin",
      planType: "free",
      subscriptionStatus: "activo",
      isActive: true,
    },
    select: { id: true, email: true, name: true, globalRole: true, planType: true },
  });

  console.log("Admin listo:", user);
  console.log("Login:", ADMIN_EMAIL, "/", ADMIN_PASSWORD);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
