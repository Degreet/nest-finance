import { Injectable } from '@nestjs/common';
import { FinanceStrategyBase } from './finance-strategy.base';
import { EntityManager } from 'typeorm';
import { FinanceStrategyData } from './finance-strategy-data.interface';
import Decimal from 'decimal.js';

@Injectable()
export class ExpenseStrategy implements FinanceStrategyBase {
  async record(
    manager: EntityManager,
    { account, amount }: FinanceStrategyData,
  ): Promise<void> {
    const balance = new Decimal(account.balance);
    account.balance = balance.minus(amount).toString();
    await manager.save(account);
  }

  async void(
    manager: EntityManager,
    { account, amount }: FinanceStrategyData,
  ): Promise<void> {
    const balance = new Decimal(account.balance);
    account.balance = balance.plus(amount).toString();
    await manager.save(account);
  }
}
