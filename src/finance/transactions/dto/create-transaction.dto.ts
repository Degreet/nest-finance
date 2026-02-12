import { TransactionType } from '../enums/transaction-type.enum';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  accountId: number;

  @IsString()
  @Matches(/^\d+\.\d{2}$/, {
    message: 'amount must be in the format 123.45',
  })
  amount: string;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Date)
  @IsDate()
  date: Date;
}
