import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1770823340131_6860';

  // CORS 配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  };

  // CSRF 配置（开发环境禁用）
  config.security = {
    csrf: {
      enable: false
    }
  };

  config.middleware = [ 'response', 'auth' ];

  // 配置全局 auth 中间件白名单（不需要登录即可访问的路由）
  config.auth = {
    ignore: [
      '/api/user/login',
      '/api/user/register',
      // 新闻列表需要精确匹配，排除收藏等需要登录的接口
      // GET /api/news?pageNum=1 这种请求会被忽略
      // POST /api/news/:id/favorite 需要登录
    ],
  };

  // change multipart mode to file
  // @see https://github.com/eggjs/multipart/blob/master/src/config/config.default.ts#L104
  config.multipart = {
    mode: 'file',
  };

  // add your special config in here
  // Usage: `app.config.bizConfig.sourceUrl`
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    bizConfig,
  };
};