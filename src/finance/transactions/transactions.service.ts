import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { AccountNotFoundException } from '../accounts/exceptions/account-not-found.exception';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    try {
      const account = await this.accountRepository.findOneByOrFail({
        id: createTransactionDto.accountId,
        user: { id: userId },
      });

      const transaction = this.transactionRepository.create({
        ...createTransactionDto,
        user: { id: userId },
        account,
      });

      const saved = await this.transactionRepository.save(transaction);

      return {
        transactionId: saved.id,
      };
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new AccountNotFoundException();
      }
      throw err;
    }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
