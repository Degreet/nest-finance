import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CloudWatchClient,
  PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';
import {
  CLOUDWATCH_CLIENT,
  CLOUDWATCH_NAMESPACE,
} from './cloudwatch.constants';
import { Metric } from './interfaces/metric.interface';

@Injectable()
export class CloudWatchService {
  private readonly logger = new Logger(CloudWatchService.name);

  constructor(
    @Inject(CLOUDWATCH_CLIENT) private readonly client: CloudWatchClient,
    @Inject(CLOUDWATCH_NAMESPACE) private readonly namespace: string,
  ) {}

  async recordMetrics(metrics: Metric[]) {
    try {
      await this.client.send(
        new PutMetricDataCommand({
          Namespace: this.namespace,
          MetricData: metrics.map((metric) => ({
            MetricName: metric.name,
            Value: metric.value,
            Unit: metric.unit,
            Timestamp: new Date(),
            Dimensions: metric.dimensions
              ? Object.entries(metric.dimensions).map(([Name, Value]) => ({
                  Name,
                  Value,
                }))
              : [],
          })),
        }),
      );
    } catch (err) {
      this.logger.error(
        'Failed to put metrics to CloudWatch:',
        err?.stack ?? err,
      );
    }
  }
}
