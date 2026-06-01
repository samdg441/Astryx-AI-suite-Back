import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";
import { env } from "../../shared/config/env";

/** Pooler (DATABASE_URL) en runtime; DIRECT_URL solo para migraciones (prisma.config.ts). */
const connectionString = env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
