import { AccessLevel, SingletonProto } from '@eggjs/tegg';
import Redis from 'ioredis';

@SingletonProto({
  accessLevel: AccessLevel.PUBLIC,
})
export class RedisService {
  private _client: Redis | null = null;

  get client(): Redis {
    if (!this._client) {
      this._client = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '63791', 10),
        password: process.env.REDIS_PASSWORD || 'admin123456',
        db: parseInt(process.env.REDIS_DB || '0', 10),
      });
    }
    return this._client;
  }
}
