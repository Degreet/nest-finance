import { Injectable } from '@nestjs/common';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionNotFoundException } from './exceptions/transaction-not-found.exception';
import { FindTransactionsQueryDto } from './dto/find-transactions-query.dto';
import { DEFAULT_TRANSACTIONS_LIMIT } from './transactions.constants';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  findAll(findTransactionsQueryDto: FindTransactionsQueryDto, userId: number) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select([
        'transaction.id',
        'transaction.amount',
        'transaction.date',
        'transaction.description',
        'transaction.type',
        'transaction.category',
        'transaction.createdAt',
        'transaction.accountId',
      ])
      .where('transaction.userId = :userId', { userId });

    if (findTransactionsQueryDto.cursor !== undefined) {
      query.andWhere('transaction.id < :cursor', {
        cursor: findTransactionsQueryDto.cursor,
      });
    }

    if (findTransactionsQueryDto.accountId !== undefined) {
      query.andWhere('transaction.accountId = :accountId', {
        accountId: findTransactionsQueryDto.accountId,
      });
    }

    return query
      .orderBy('transaction.id', 'DESC')
      .limit(findTransactionsQueryDto.limit ?? DEFAULT_TRANSACTIONS_LIMIT)
      .getMany();
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    userId: number,
  ) {
    const result = await this.transactionRepository.update(
      { id, user: { id: userId } },
      { ...updateTransactionDto },
    );
    if (result.affected === 0) {
      throw new TransactionNotFoundException();
    }
  }

  async remove(id: number, userId: number) {
    const result = await this.transactionRepository.delete({
      id,
      user: { id: userId },
    });
    if (result.affected === 0) {
      throw new TransactionNotFoundException();
    }
  }
}
