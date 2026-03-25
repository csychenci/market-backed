import 'egg';

declare module 'egg' {
  interface Application {
    redis: any; // 或者 import { Redis } from 'ioredis' 并声明为 Redis 实例
    jwt: any;
  }
}
