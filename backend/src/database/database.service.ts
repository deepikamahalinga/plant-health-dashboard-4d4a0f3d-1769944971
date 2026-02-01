import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { HealthCheckError } from '@nestjs/terminus';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Connection pooling configuration
      connectionLimit: 20,
      pool: {
        min: 2,
        max: 20,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');

      // Enable query logging in development
      if (process.env.NODE_ENV === 'development') {
        this.$use(async (params, next) => {
          const before = Date.now();
          const result = await next(params);
          const after = Date.now();
          this.logger.debug(
            `Query ${params.model}.${params.action} took ${after - before}ms`
          );
          return result;
        });
      }
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Successfully disconnected from database');
    } catch (error) {
      this.logger.error('Error disconnecting from database', error);
      throw error;
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      throw new HealthCheckError(
        'Database health check failed',
        error
      );
    }
  }

  // Transaction helper with automatic rollback on error
  async executeTransaction<T>(
    fn: (prisma: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    try {
      return await this.$transaction(async (prisma) => {
        return await fn(prisma);
      }, {
        maxWait: 5000, // max time to wait for transaction to start
        timeout: 10000, // max time for entire transaction
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      });
    } catch (error) {
      this.logger.error('Transaction failed', error);
      throw error;
    }
  }

  // Reconnection helper
  async reconnect(): Promise<void> {
    try {
      await this.$disconnect();
      await this.$connect();
      this.logger.log('Successfully reconnected to database');
    } catch (error) {
      this.logger.error('Failed to reconnect to database', error);
      throw error;
    }
  }

  // Custom error handler
  handleError(error: Error): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      this.logger.error(`Prisma Error ${error.code}: ${error.message}`);
      throw error;
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      // Handle validation errors
      this.logger.error(`Validation Error: ${error.message}`);
      throw error;
    } else {
      // Handle other errors
      this.logger.error(`Database Error: ${error.message}`);
      throw error;
    }
  }

  // Soft shutdown helper
  async gracefulShutdown(): Promise<void> {
    try {
      // Wait for ongoing queries to complete (max 5 seconds)
      await Promise.race([
        new Promise((resolve) => setTimeout(resolve, 5000)),
        this.$disconnect(),
      ]);
      this.logger.log('Gracefully shut down database connection');
    } catch (error) {
      this.logger.error('Error during graceful shutdown', error);
      throw error;
    }
  }
}