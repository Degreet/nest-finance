export class AdjustTransactionCommand {
  constructor(
    public readonly userId: number,
    public readonly transactionId: number,
    public readonly amount?: string,
    public readonly category?: string,
    public readonly date?: Date,
    public readonly description?: string,
  ) {}
}
