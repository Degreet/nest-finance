import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { CreateTransactionHandler } from './commands/create-transaction/create-transaction.handler';
import { UpdateTransactionHandler } from './commands/update-transaction/update-transaction.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account])],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    CreateTransactionHandler,
    UpdateTransactionHandler,
  ],
})
export class TransactionsModule {}
