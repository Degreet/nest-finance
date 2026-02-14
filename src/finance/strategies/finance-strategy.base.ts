import { EntityManager } from 'typeorm';
import { FinanceStrategyData } from './finance-strategy-data.interface';

export abstract class FinanceStrategyBase {
  abstract record(
    manager: EntityManager,
    data: FinanceStrategyData,
  ): Promise<void>;

  abstract void(
    manager: EntityManager,
    data: FinanceStrategyData,
  ): Promise<void>;
}
