export const USER_REGISTERED = 'user.registered' as const;

export class UserRegisteredEvent {
  constructor(public readonly userId: number) {}
}
