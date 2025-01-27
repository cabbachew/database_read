import { PrismaClient } from "@prisma/client";

// To avoid creating multiple instances of PrismaClient in development
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ['query'], // uncomment this if you want to see queries
  });

// In dev mode, store the Prisma client instance in a global variable
// so we don't re-initialize between hot reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
