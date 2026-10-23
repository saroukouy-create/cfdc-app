import { PrismaClient } from "@prisma/client"

// Un seul client en dev (le rechargement a chaud recree les modules)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
