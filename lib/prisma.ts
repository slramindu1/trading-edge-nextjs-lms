// lib/prisma.ts
import { PrismaClient } from "./generated/prisma"; // ✅ named import

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["query", "info"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
