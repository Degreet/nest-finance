import { NotFoundException } from '@nestjs/common';

export class AccountNotFoundException extends NotFoundException {
  constructor() {
    super('Account not found');
  }
}
