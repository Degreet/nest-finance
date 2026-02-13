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
import type { Request, Response } from 'express';
import { Metric } from '../interfaces/metric.interface';

@Injectable()
export class RequestMetricsInterceptor implements NestInterceptor {
  constructor(private readonly cloudwatchService: CloudWatchService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { route, method } = request;

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          this.recordMetrics(method, route?.path, statusCode, start);
        },
        error: (error: unknown) => {
          const statusCode =
            error instanceof HttpException ? error.getStatus() : 500;
          this.recordMetrics(method, route?.path, statusCode, start, true);
        },
      }),
    );
  }

  private recordMetrics(
    method: string,
    routePath: string | undefined,
    statusCode: number,
    start: number,
    isError: boolean = false,
  ) {
    const duration = Date.now() - start;
    const statusClass = Math.floor(statusCode / 100) + 'xx';

    const dimensions: Metric['dimensions'] = {
      Method: method,
      Route: routePath ?? 'unknown',
      StatusClass: statusClass,
    };

    const metrics: Metric[] = [
      {
        name: 'HttpTotalRequests',
        value: 1,
        unit: StandardUnit.Count,
        dimensions,
      },
      {
        name: 'ResponseTime',
        value: duration,
        unit: StandardUnit.Milliseconds,
        dimensions,
      },
    ];

    if (isError) {
      metrics.push({
        name: 'HttpErrors',
        value: 1,
        unit: StandardUnit.Count,
        dimensions,
      });
    }

    this.cloudwatchService.recordMetrics(metrics);
  }
}
