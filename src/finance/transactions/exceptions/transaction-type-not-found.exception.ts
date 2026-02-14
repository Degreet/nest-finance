import { BadRequestException } from '@nestjs/common';
import { TransactionType } from '../enums/transaction-type.enum';

export class TransactionTypeNotFoundException extends BadRequestException {
  constructor(type: TransactionType) {
    super(`Transaction type ${type} not found`);
  }
}
