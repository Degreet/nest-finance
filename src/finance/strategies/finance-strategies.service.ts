import { Injectable } from '@nestjs/common';
import { TransactionType } from '../transactions/enums/transaction-type.enum';
import { FinanceStrategyBase } from './finance-strategy.base';
import { IncomeStrategy } from './income.strategy';
import { ExpenseStrategy } from './expense.strategy';
import { TransactionTypeNotFoundException } from '../transactions/exceptions/transaction-type-not-found.exception';

@Injectable()
export class FinanceStrategiesService {
  private readonly strategies: Record<TransactionType, FinanceStrategyBase>;

  constructor(
    private readonly incomeStrategy: IncomeStrategy,
    private readonly expenseStrategy: ExpenseStrategy,
  ) {
    this.strategies = {
      [TransactionType.INCOME]: this.incomeStrategy,
      [TransactionType.EXPENSE]: this.expenseStrategy,
    };
  }

  getStrategy(type: TransactionType): FinanceStrategyBase {
    const strategy = this.strategies[type];
    if (!strategy) {
      throw new TransactionTypeNotFoundException(type);
    }
    return strategy;
  }
}
