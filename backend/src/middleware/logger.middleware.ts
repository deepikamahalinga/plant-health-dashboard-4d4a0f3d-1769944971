// middleware/request-logging.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface RequestWithId extends Request {
  id: string;
}

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: RequestWithId, res: Response, next: NextFunction): void {
    // Add request ID for tracing
    req.id = uuidv4();
    
    // Log request start
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    
    // Initial request log
    this.logger.log(
      `[${req.id}] ${method} ${originalUrl} - Started - IP: ${ip}`
    );

    // Log response using event listener
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      // Choose log level based on status code
      if (statusCode >= 500) {
        this.logger.error(
          `[${req.id}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `[${req.id}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`
        );
      } else {
        this.logger.log(
          `[${req.id}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`
        );
      }
    });

    next();
  }
}

// config/logger.config.ts
import { LoggerService, LogLevel } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  private readonly environment: string;
  
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
  }

  private getLogLevels(): LogLevel[] {
    if (this.environment === 'production') {
      return ['log', 'warn', 'error'];
    }
    return ['debug', 'verbose', 'log', 'warn', 'error'];
  }

  log(message: string, context?: string) {
    if (this.getLogLevels().includes('log')) {
      console.log(`[${context}] ${message}`);
    }
  }

  error(message: string, trace?: string, context?: string) {
    if (this.getLogLevels().includes('error')) {
      console.error(`[${context}] ${message}`, trace);
    }
  }

  warn(message: string, context?: string) {
    if (this.getLogLevels().includes('warn')) {
      console.warn(`[${context}] ${message}`);
    }
  }

  debug(message: string, context?: string) {
    if (this.getLogLevels().includes('debug')) {
      console.debug(`[${context}] ${message}`);
    }
  }

  verbose(message: string, context?: string) {
    if (this.getLogLevels().includes('verbose')) {
      console.log(`[${context}] ${message}`);
    }
  }
}

// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';

@Module({
  imports: [],
  providers: [
    {
      provide: 'Logger',
      useClass: CustomLogger,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggingMiddleware)
      .forRoutes('*');
  }
}

// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  await app.listen(3000);
}
bootstrap();