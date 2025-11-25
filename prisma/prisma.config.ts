import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  adapter: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
  },
});

