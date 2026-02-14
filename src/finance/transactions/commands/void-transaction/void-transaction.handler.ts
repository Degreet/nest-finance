import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

import { VoidTransactionCommand } from './void-transaction.command';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionNotFoundException } from '../../exceptions/transaction-not-found.exception';
import { FinanceStrategiesService } from '../../../strategies/finance-strategies.service';

@CommandHandler(VoidTransactionCommand)
export class VoidTransactionHandler implements ICommandHandler<VoidTransactionCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly financeStrategiesService: FinanceStrategiesService,
  ) {}

  execute(command: VoidTransactionCommand) {
    return this.dataSource.transaction(async (manager) => {
      const transaction = await manager.findOne(Transaction, {
        where: {
          id: command.transactionId,
          user: { id: command.userId },
        },
        relations: ['account'],
      });
      if (!transaction) {
        throw new TransactionNotFoundException();
      }

      const { account, amount, type } = transaction;

      const strategy = this.financeStrategiesService.getStrategy(type);
      await strategy.void(manager, { account, amount });

      await manager.remove(transaction);
    });
  }
}
