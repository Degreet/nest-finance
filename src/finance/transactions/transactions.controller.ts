import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';
import type { ActiveUserData } from '../../iam/interfaces/active-user-data.interface';
import { FindTransactionsQueryDto } from './dto/find-transactions-query.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './commands/create-transaction/create-transaction.command';
import { CreateTransactionResult } from './commands/create-transaction/create-transaction-result.interface';
import { UpdateTransactionCommand } from './commands/update-transaction/update-transaction.command';
import { RemoveTransactionCommand } from './commands/remove-transaction/remove-transaction.command';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<CreateTransactionResult> {
    const command = new CreateTransactionCommand(
      createTransactionDto.type,
      user.sub,
      createTransactionDto.accountId,
      createTransactionDto.amount,
      createTransactionDto.category,
      createTransactionDto.date,
      createTransactionDto.description,
    );
    return this.commandBus.execute(command);
  }

  @Get()
  findAll(
    @Query() findTransactionsQueryDto: FindTransactionsQueryDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.transactionsService.findAll(findTransactionsQueryDto, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    const command = new UpdateTransactionCommand(
      user.sub,
      id,
      updateTransactionDto.amount,
      updateTransactionDto.category,
      updateTransactionDto.date,
      updateTransactionDto.description,
    );
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserData,
  ) {
    const command = new RemoveTransactionCommand(user.sub, id);
    return this.commandBus.execute(command);
  }
}
