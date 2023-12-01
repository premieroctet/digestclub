export const PRISMA_NOT_FOUND_ERROR_CODES = ['P2018', 'P2025'];

export function isPrismaNotFoundError(error: any) {
  return PRISMA_NOT_FOUND_ERROR_CODES.includes(error.code);
}
