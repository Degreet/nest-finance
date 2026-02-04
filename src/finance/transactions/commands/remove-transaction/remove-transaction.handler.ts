import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import Decimal from 'decimal.js';

import { RemoveTransactionCommand } from './remove-transaction.command';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionType } from '../../enums/transaction-type.enum';
import { TransactionNotFoundException } from '../../exceptions/transaction-not-found.exception';

@CommandHandler(RemoveTransactionCommand)
export class RemoveTransactionHandler implements ICommandHandler<RemoveTransactionCommand> {
  constructor(private readonly dataSource: DataSource) {}

  execute(command: RemoveTransactionCommand) {
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

      const { account, amount } = transaction;
      const balance = new Decimal(account.balance);

      if (transaction.type === TransactionType.INCOME) {
        account.balance = balance.minus(amount).toString();
      } else if (transaction.type === TransactionType.EXPENSE) {
        account.balance = balance.plus(amount).toString();
      }

      await manager.save(account);
      await manager.remove(transaction);
    });
  }
}
