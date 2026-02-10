export class AdjustTransactionCommand {
  constructor(
    public readonly userId: number,
    public readonly transactionId: number,
    public readonly amount?: string,
    public readonly categoryId?: number,
    public readonly date?: Date,
    public readonly description?: string,
  ) {}
}
