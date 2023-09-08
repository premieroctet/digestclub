import { Prisma, PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const db = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

export default db;

export const isUniqueConstraintError = (e: unknown) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002';

export const isNotFoundError = (e: unknown) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025';
