import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { EntityManager, Repository } from 'typeorm';
import { AccountNotFoundException } from './exceptions/account-not-found.exception';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto, userId: number) {
    const account = this.accountRepository.create({
      ...createAccountDto,
      user: { id: userId },
    });

    const saved = await this.accountRepository.save(account);

    return {
      accountId: saved.id,
    };
  }

  findAll(userId: number) {
    return this.accountRepository.findBy({
      user: { id: userId },
    });
  }

  async findOneOrFail(manager: EntityManager, id: number, userId: number) {
    const entity = await manager.findOneBy(Account, {
      id,
      user: { id: userId },
    });
    if (!entity) {
      throw new AccountNotFoundException();
    }
    return entity;
  }

  async update(id: number, updateAccountDto: UpdateAccountDto, userId: number) {
    const result = await this.accountRepository.update(
      { id, user: { id: userId } },
      { ...updateAccountDto },
    );
    if (result.affected === 0) {
      throw new AccountNotFoundException();
    }
  }

  async remove(id: number, userId: number) {
    const result = await this.accountRepository.delete({
      id,
      user: { id: userId },
    });
    if (result.affected === 0) {
      throw new AccountNotFoundException();
    }
  }
}
