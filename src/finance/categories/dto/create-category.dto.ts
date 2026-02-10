import { TransactionType } from '../../transactions/enums/transaction-type.enum';
import { IsEnum, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(TransactionType)
  type: TransactionType;
}
