import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [AccountsModule, TransactionsModule, CategoriesModule],
})
export class FinanceModule {}
