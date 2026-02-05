import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecordTransactionCommand } from './record-transaction.command';
import { DataSource } from 'typeorm';
import { Account } from '../../../accounts/entities/account.entity';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionType } from '../../enums/transaction-type.enum';
import { AccountNotFoundException } from '../../../accounts/exceptions/account-not-found.exception';
import { RecordTransactionResult } from './record-transaction-result.interface';
import Decimal from 'decimal.js';

@CommandHandler(RecordTransactionCommand)
export class RecordTransactionHandler implements ICommandHandler<
  RecordTransactionCommand,
  RecordTransactionResult
> {
  constructor(private readonly dataSource: DataSource) {}

  execute(command: RecordTransactionCommand) {
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
