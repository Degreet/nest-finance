import { Account } from '../accounts/entities/account.entity';

export interface FinanceStrategyData {
  account: Account;
  amount: string;
}
