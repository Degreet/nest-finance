export class VoidTransactionCommand {
  constructor(
    public readonly userId: number,
    public readonly transactionId: number,
  ) {}
}
