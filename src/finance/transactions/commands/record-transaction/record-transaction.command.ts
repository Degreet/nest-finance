import { TransactionType } from '../../enums/transaction-type.enum';

export class RecordTransactionCommand {
  constructor(
    public readonly type: TransactionType,
    public readonly userId: number,
    public readonly accountId: number,
    public readonly amount: string,
    public readonly categoryId: number,
    public readonly date: Date,
    public readonly description?: string,
  ) {}
}
