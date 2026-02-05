import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { AccountType } from '../enums/account-type.enum';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsString()
  @Length(3, 3)
  currency: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+\.\d{2}$/, {
    message: 'balance must be in the format 123.45',
  })
  balance: string;
}
