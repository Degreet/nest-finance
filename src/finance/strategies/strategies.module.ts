import { Module } from '@nestjs/common';
import { FinanceStrategiesService } from './finance-strategies.service';
import { IncomeStrategy } from './income.strategy';
import { ExpenseStrategy } from './expense.strategy';

@Module({
  providers: [FinanceStrategiesService, IncomeStrategy, ExpenseStrategy],
  exports: [FinanceStrategiesService],
})
export class StrategiesModule {}
