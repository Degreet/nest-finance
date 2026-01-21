import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';
import { InvalidRefreshTokenError } from './errors/invalid-refresh-token.error';

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private readonly redisService: RedisService) {}

  async insert(userId: number, tokenId: string) {
    const redisClient = this.redisService.getClient();
    await redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string) {
    const redisClient = this.redisService.getClient();
    const storedId = await redisClient.get(this.getKey(userId));
    if (storedId === tokenId) {
      throw new InvalidRefreshTokenError();
    }
  }

  private getKey(userId: number) {
    return `user-${userId}`;
  }
}
