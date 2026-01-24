import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';

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

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  async update(id: number, updateAccountDto: UpdateAccountDto, userId: number) {
    const result = await this.accountRepository.update(
      { id, user: { id: userId } },
      { ...updateAccountDto },
    );
    if (result.affected === 0) {
      throw new NotFoundException('Account not found');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
