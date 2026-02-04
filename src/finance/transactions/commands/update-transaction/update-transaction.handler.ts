import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import Decimal from 'decimal.js';

import { UpdateTransactionCommand } from './update-transaction.command';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionType } from '../../enums/transaction-type.enum';
import { TransactionNotFoundException } from '../../exceptions/transaction-not-found.exception';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler implements ICommandHandler<UpdateTransactionCommand> {
  constructor(private readonly dataSource: DataSource) {}

  execute(command: UpdateTransactionCommand) {
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

      const oldAmount = transaction.amount;
      const newAmount = command.amount;

      Object.assign(transaction, {
        amount: newAmount,
        category: command.category,
        date: command.date,
        description: command.description,
      });

      if (needsAccount && newAmount && oldAmount !== newAmount) {
        const { account } = transaction;
        const balance = new Decimal(account.balance);
        if (transaction.type === TransactionType.INCOME) {
          account.balance = balance.minus(oldAmount).plus(newAmount).toString();
        } else if (transaction.type === TransactionType.EXPENSE) {
          account.balance = balance.plus(oldAmount).minus(newAmount).toString();
        }
        await manager.save(account);
      }

      await manager.save(transaction);
    });
  }
}
