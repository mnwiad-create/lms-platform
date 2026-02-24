import { AsyncLocalStorage } from 'node:async_hooks';
import { PrismaClient } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// Request context (AsyncLocalStorage for per-request orgId)
// ─────────────────────────────────────────────────────────────

interface RequestContext {
  orgId: string;
  userId?: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getRequestOrgId(): string | undefined {
  return requestContext.getStore()?.orgId;
}

export function getRequestUserId(): string | undefined {
  return requestContext.getStore()?.userId;
}

// ─────────────────────────────────────────────────────────────
// Prisma singleton
// ─────────────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// System tables excluded from orgId injection
const SYSTEM_TABLES = new Set(['Organization', 'SystemConfig']);

// Multi-tenant middleware: auto-inject orgId into queries
prisma.$use(async (params, next) => {
  // Skip system tables that have no orgId
  if (params.model && SYSTEM_TABLES.has(params.model)) {
    return next(params);
  }

  const orgId = getRequestOrgId();
  if (!orgId) {
    return next(params);
  }

  switch (params.action) {
    case 'findMany':
    case 'findFirst':
    case 'count':
    case 'aggregate':
    case 'groupBy': {
      params.args = params.args ?? {};
      params.args.where = { ...params.args.where, orgId };
      break;
    }

    case 'findUnique':
    case 'findUniqueOrThrow':
    case 'findFirstOrThrow': {
      // These use unique selectors — do NOT override the where clause
      // orgId isolation is enforced at route level for unique lookups
      break;
    }

    case 'create': {
      params.args = params.args ?? {};
      params.args.data = { ...params.args.data, orgId };
      break;
    }

    case 'createMany': {
      params.args = params.args ?? {};
      if (Array.isArray(params.args.data)) {
        params.args.data = (params.args.data as Record<string, unknown>[]).map((d) => ({
          ...d,
          orgId,
        }));
      }
      break;
    }

    case 'update':
    case 'updateMany':
    case 'delete':
    case 'deleteMany': {
      params.args = params.args ?? {};
      params.args.where = { ...params.args.where, orgId };
      break;
    }

    default:
      break;
  }

  return next(params);
});
