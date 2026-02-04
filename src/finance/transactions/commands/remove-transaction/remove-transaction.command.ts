export class RemoveTransactionCommand {
  constructor(
    public readonly userId: number,
    public readonly transactionId: number,
  ) {}
}
