import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IamModule } from './iam/iam.module';
import { FinanceModule } from './finance/finance.module';
import Joi from 'joi';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CloudWatchModule } from './cloudwatch/cloudwatch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'staging', 'test')
          .default('development'),
        DB_HOST: Joi.required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.required(),
        DB_PASSWORD: Joi.required(),
        DB_NAME: Joi.required(),
        DB_SSL: Joi.boolean().default(false),
        JWT_SECRET: Joi.required(),
        JWT_TOKEN_AUDIENCE: Joi.required(),
        JWT_TOKEN_ISSUER: Joi.required(),
        JWT_ACCESS_TOKEN_TTL: Joi.number().default(3600),
        JWT_REFRESH_TOKEN_TTL: Joi.number().default(86400),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        AWS_REGION: Joi.when('NODE_ENV', {
          is: 'production',
          then: Joi.string().required(),
          otherwise: Joi.string().optional(),
        }),
        CLOUDWATCH_NAMESPACE: Joi.when('NODE_ENV', {
          is: 'production',
          then: Joi.string().required(),
          otherwise: Joi.string().optional(),
        }),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          ssl: configService.get<boolean>('DB_SSL')
            ? { rejectUnauthorized: false }
            : false,
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV === 'development',
          logging: process.env.NODE_ENV === 'development',
        };
      },
    }),
    EventEmitterModule.forRoot(),
    IamModule,
    FinanceModule,
    ...(process.env.NODE_ENV === 'production' ? [CloudWatchModule] : []),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
