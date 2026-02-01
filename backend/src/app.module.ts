// app.module.ts

import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WsAdapter } from '@nestjs/platform-ws';

// Entity Modules
import { PlantDataModule } from './modules/plant-data/plant-data.module';

// Auth Module
import { AuthModule } from './modules/auth/auth.module';

// Core Modules
import { HealthModule } from './modules/health/health.module';
import { DataCollectionModule } from './modules/data-collection/data-collection.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

// Middleware
import { LoggerMiddleware } from './middleware/logger.middleware';
import { SecurityMiddleware } from './middleware/security.middleware';

// Entity
import { PlantData } from './entities/plant-data.entity';

// Configuration
import configuration from './config/configuration';
import { validateEnvironment } from './config/environment.validation';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnvironment,
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [PlantData],
        synchronize: false, // Disable in production
        logging: configService.get('database.logging'),
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('rateLimit.ttl'),
        limit: configService.get('rateLimit.limit'),
      }),
      inject: [ConfigService],
    }),

    // Queue Processing
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),

    // Event Handling
    EventEmitterModule.forRoot(),

    // Health Checks
    TerminusModule,
    HealthModule,

    // Core Modules
    AuthModule,
    PlantDataModule,
    DataCollectionModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, SecurityMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  constructor(private configService: ConfigService) {}
}