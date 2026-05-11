import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";
import { env } from "../../shared/config/env";

const connectionString = env.DIRECT_URL ?? env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
