import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

import { AdjustTransactionCommand } from './adjust-transaction.command';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionNotFoundException } from '../../exceptions/transaction-not-found.exception';
import { Category } from '../../../categories/entities/category.entity';
import { CategoryNotFoundException } from '../../../categories/exceptions/category-not-found.exception';
import { FinanceStrategiesService } from '../../../strategies/finance-strategies.service';

@CommandHandler(AdjustTransactionCommand)
export class AdjustTransactionHandler implements ICommandHandler<AdjustTransactionCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly financeStrategiesService: FinanceStrategiesService,
  ) {}

  execute(command: AdjustTransactionCommand) {
    return this.dataSource.transaction(async (manager) => {
      const needsAccount = command.amount !== undefined;
      const transaction = await manager.findOne(Transaction, {
        where: {
          id: command.transactionId,
          user: { id: command.userId },
        },
        relations: needsAccount ? ['account'] : [],
      });
      if (!transaction) {
        throw new TransactionNotFoundException();
      }

      if (command.categoryId !== undefined) {
        const category = await manager.findOneBy(Category, {
          id: command.categoryId,
          user: { id: command.userId },
          type: transaction.type,
        });
        if (!category) {
          throw new CategoryNotFoundException();
        }
        transaction.category = category;
      }

      const oldAmount = transaction.amount;
      const newAmount = command.amount;

      Object.assign(transaction, {
        amount: newAmount,
        date: command.date,
        description: command.description,
      });

      if (needsAccount && newAmount && oldAmount !== newAmount) {
        const { account, type } = transaction;
        const strategy = this.financeStrategiesService.getStrategy(type);
        await strategy.void(manager, { account, amount: oldAmount });
        await strategy.record(manager, { account, amount: newAmount });
      }

      await manager.save(transaction);
    });
  }
}
