import { StandardUnit } from '@aws-sdk/client-cloudwatch';

export interface Metric {
  name: string;
  value: number;
  unit: StandardUnit;
  dimensions?: Record<string, string>;
}
