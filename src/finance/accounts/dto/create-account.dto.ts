import { IsEnum, IsNumber, IsString, Length } from 'class-validator';
import { AccountType } from '../enums/account-type.enum';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsString()
  @Length(3, 3)
  currency: string;

  @IsNumber()
  initial_balance: number;
}
