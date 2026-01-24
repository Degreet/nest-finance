import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';
import type { ActiveUserData } from '../../iam/interfaces/active-user-data.interface';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.accountsService.create(createAccountDto, user.sub);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserData) {
    return this.accountsService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.accountsService.update(id, updateAccountDto, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }
}
