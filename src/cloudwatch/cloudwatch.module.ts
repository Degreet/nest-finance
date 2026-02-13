import { Module } from '@nestjs/common';
import { CloudWatchService } from './cloudwatch.service';
import {
  CLOUDWATCH_CLIENT,
  CLOUDWATCH_NAMESPACE,
} from './cloudwatch.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestMetricsInterceptor } from './interceptors/request-metrics.interceptor';

@Module({
  imports: [ConfigModule],
  providers: [
    CloudWatchService,
    {
      provide: CLOUDWATCH_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new CloudWatchClient({
          region: configService.get('AWS_REGION'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: CLOUDWATCH_NAMESPACE,
      useFactory: (configService: ConfigService) =>
        configService.get('CLOUDWATCH_NAMESPACE'),
      inject: [ConfigService],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestMetricsInterceptor,
    },
  ],
})
export class CloudWatchModule {}
