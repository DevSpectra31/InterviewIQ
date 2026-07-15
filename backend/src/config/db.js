import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma Client instance.
 * Prevents multiple instances during hot-reloading in development.
 */

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Connect to PostgreSQL via Prisma.
 * Called during server startup.
 */
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected via Prisma');
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    console.error(
      '   Make sure PostgreSQL is running and DATABASE_URL in .env is correct'
    );
    process.exit(1);
  }
};

/**
 * Gracefully disconnect Prisma on shutdown.
 */
export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log('🔌 PostgreSQL disconnected');
};

export default prisma;
