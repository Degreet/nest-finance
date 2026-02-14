import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecordTransactionCommand } from './record-transaction.command';
import { DataSource } from 'typeorm';
import { Account } from '../../../accounts/entities/account.entity';
import { Transaction } from '../../entities/transaction.entity';
import { AccountNotFoundException } from '../../../accounts/exceptions/account-not-found.exception';
import { RecordTransactionResult } from './record-transaction-result.interface';
import { Category } from '../../../categories/entities/category.entity';
import { CategoryNotFoundException } from '../../../categories/exceptions/category-not-found.exception';
import { FinanceStrategiesService } from '../../../strategies/finance-strategies.service';

@CommandHandler(RecordTransactionCommand)
export class RecordTransactionHandler implements ICommandHandler<
  RecordTransactionCommand,
  RecordTransactionResult
> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly financeStrategiesService: FinanceStrategiesService,
  ) {}

  execute(command: RecordTransactionCommand) {
    return this.dataSource.transaction(async (manager) => {
      const [account, category] = await Promise.all([
        manager.findOneBy(Account, {
          id: command.accountId,
          user: { id: command.userId },
        }),
        manager.findOneBy(Category, {
          id: command.categoryId,
          user: { id: command.userId },
          type: command.type,
        }),
      ]);
      if (!account) throw new AccountNotFoundException();
      if (!category) throw new CategoryNotFoundException();

      const transaction = manager.create(Transaction, {
        ...command,
        user: { id: command.userId },
        category,
        account,
      });
      const saved = await manager.save(transaction);

      const { type, amount } = transaction;

      const strategy = this.financeStrategiesService.getStrategy(type);
      await strategy.record(manager, { account, amount });

      return {
        transactionId: saved.id,
      };
    });
  }
}
