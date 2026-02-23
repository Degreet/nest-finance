import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { FindTransactionsQueryDto } from './dto/find-transactions-query.dto';
import { DEFAULT_TRANSACTIONS_LIMIT } from './transactions.constants';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionNotFoundException } from './exceptions/transaction-not-found.exception';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FinanceStrategiesService } from '../strategies/finance-strategies.service';
import { CategoriesService } from '../categories/categories.service';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
    private readonly financeStrategiesService: FinanceStrategiesService,
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
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
        'transaction.createdAt',
        'transaction.accountId',
      ])
      .leftJoin('transaction.category', 'category')
      .addSelect(['category.id', 'category.name', 'category.type'])
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

  record(dto: CreateTransactionDto, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const [account, category] = await Promise.all([
        this.accountsService.findOneOrFail(manager, dto.accountId, userId),
        this.categoriesService.findOneOrFail(
          manager,
          dto.categoryId,
          userId,
          dto.type,
        ),
      ]);

      const transaction = manager.create(Transaction, {
        ...dto,
        user: { id: userId },
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

  adjust(id: number, dto: UpdateTransactionDto, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const needsAccount = dto.amount !== undefined;
      const transaction = await manager.findOne(Transaction, {
        where: { id, user: { id: userId } },
        relations: needsAccount ? ['account'] : [],
      });
      if (!transaction) {
        throw new TransactionNotFoundException();
      }

      if (dto.categoryId !== undefined) {
        transaction.category = await this.categoriesService.findOneOrFail(
          manager,
          dto.categoryId,
          userId,
          transaction.type,
        );
      }

      const oldAmount = transaction.amount;
      const newAmount = dto.amount;

      Object.assign(transaction, {
        amount: newAmount,
        date: dto.date,
        description: dto.description,
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

  void(id: number, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const transaction = await manager.findOne(Transaction, {
        where: { id, user: { id: userId } },
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
