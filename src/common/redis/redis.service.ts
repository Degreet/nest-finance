import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';

import { REDIS_CLIENT } from './redis.constants';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {
    this.redisClient.on('error', (err) => {
      this.logger.error(`Redis error: ${err.message}`);
    });
  }

  onApplicationShutdown() {
    return this.redisClient.quit();
  }

  getClient() {
    return this.redisClient;
  }
}
