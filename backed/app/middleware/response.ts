import { Context, Application } from 'egg';

export default function responseMiddleware(options: any, app: Application) {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (err: any) {
      ctx.status = err.status || 500;
      ctx.body = {
        code: err.code || err.status || 500,
        data: null,
        message: err.message || '服务器内部错误',
      };

      ctx.logger.error('[ResponseMiddleware] Unhandled error:', err);
    }
  };
}
