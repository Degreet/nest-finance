import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CloudWatchService } from '../cloudwatch.service';
import { Observable, tap } from 'rxjs';
import { StandardUnit } from '@aws-sdk/client-cloudwatch';
import type { Response } from 'express';
import { Metric } from '../interfaces/metric.interface';

@Injectable()
export class RequestMetricsInterceptor implements NestInterceptor {
  constructor(private readonly cloudwatchService: CloudWatchService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const start = Date.now();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          this.recordMetrics(statusCode, start);
        },
        error: (error: unknown) => {
          const statusCode =
            error instanceof HttpException ? error.getStatus() : 500;
          this.recordMetrics(statusCode, start, true);
        },
      }),
    );
  }

  private recordMetrics(
    statusCode: number,
    start: number,
    isError: boolean = false,
  ) {
    const duration = Date.now() - start;
    const statusClass = Math.floor(statusCode / 100) + 'xx';

    const metrics: Metric[] = [
      {
        name: 'HttpTotalRequests',
        value: 1,
        unit: StandardUnit.Count,
      },
      {
        name: 'HttpRequestsByStatus',
        value: 1,
        unit: StandardUnit.Count,
        dimensions: { StatusClass: statusClass },
      },
      {
        name: 'HttpLatency',
        value: duration,
        unit: StandardUnit.Milliseconds,
      },
    ];

    if (isError) {
      metrics.push({
        name: 'HttpErrors',
        value: 1,
        unit: StandardUnit.Count,
      });
    }

    this.cloudwatchService.recordMetrics(metrics);
  }
}
