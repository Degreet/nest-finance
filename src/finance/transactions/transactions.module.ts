import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { RecordTransactionHandler } from './commands/record-transaction/record-transaction.handler';
import { AdjustTransactionHandler } from './commands/adjust-transaction/adjust-transaction.handler';
import { VoidTransactionHandler } from './commands/void-transaction/void-transaction.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    RecordTransactionHandler,
    AdjustTransactionHandler,
    VoidTransactionHandler,
  ],
})
export class TransactionsModule {}
