import { Context } from 'egg';
import * as jwt from 'jsonwebtoken';
import Redis from 'ioredis';

const JWT_SECRET = process.env.JWT_SECRET || 'backed_jwt_secret_token_12345';

// 中间件级别的 Redis 单例（和 RedisService 共享相同配置）
let redisClient: Redis | null = null;
function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '63791', 10),
      password: process.env.REDIS_PASSWORD || 'admin123456',
      db: parseInt(process.env.REDIS_DB || '0', 10),
    });
  }
  return redisClient;
}

export default function authMiddleware(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    // 1. 获取 token
    let token = ctx.request.header.authorization as string;
    if (token && token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '');
    }

    if (!token) {
      ctx.status = 401;
      ctx.body = { code: 401, message: '未登录，请先登录' };
      return;
    }

    console.log("api",ctx)

    try {
      // 2. 校验 JWT 合法性
      const decoded: any = jwt.verify(token, JWT_SECRET);

      // 3. 核对 Redis 白名单（主动退出 / 单点登录控制）
      const redisToken = await getRedis().get(`user:token:${decoded.id}`);
      console.log("redisToken", redisToken,token)
      if (!redisToken || redisToken !== token) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '登录已过期或在其他设备登录，请重新登录' };
        return;
      }

      // 4. 注入当前用户信息供后续使用
      ctx.state.user = decoded;

      await next();
    } catch (error) {
      ctx.status = 401;
      ctx.body = { code: 401, message: '无效的访问令牌（或已过期）' };
    }
  };
}
