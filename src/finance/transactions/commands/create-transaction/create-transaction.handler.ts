import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';
import { DataSource } from 'typeorm';
import { Account } from '../../../accounts/entities/account.entity';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionType } from '../../enums/transaction-type.enum';
import { AccountNotFoundException } from '../../../accounts/exceptions/account-not-found.exception';
import { CreateTransactionResult } from './create-transaction-result.interface';
import Decimal from 'decimal.js';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<
  CreateTransactionCommand,
  CreateTransactionResult
> {
  constructor(private readonly dataSource: DataSource) {}

  execute(command: CreateTransactionCommand) {
    return this.dataSource.transaction(async (manager) => {
      const account = await manager.findOneBy(Account, {
        id: command.accountId,
        user: { id: command.userId },
      });
      if (!account) {
        throw new AccountNotFoundException();
      }
      const transaction = manager.create(Transaction, {
        ...command,
        user: { id: command.userId },
        account,
      });
      const saved = await manager.save(transaction);

      const balance = new Decimal(account.balance);

      if (transaction.type === TransactionType.INCOME) {
        account.balance = balance.plus(transaction.amount).toString();
      } else if (transaction.type === TransactionType.EXPENSE) {
        account.balance = balance.minus(transaction.amount).toString();
      }
      await manager.save(account);

      return {
        transactionId: saved.id,
      };
    });
  }
}
