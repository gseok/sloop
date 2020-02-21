import { Middleware, Context, Next } from 'koa';
import send from 'koa-send';
import logger from '../helpers/logger';

const staticServe: Middleware = async (ctx: Context, next: Next) => {
  logger.info('req > ', ctx.path, __dirname);
  if (ctx.path.includes('.css') || ctx.path.includes('.js')) {
    // css an js cached 5min
    // ctx.set('Cache-Control', 'public, max-age=300');
    await send(ctx, ctx.path, { root: `${__dirname}/../client/web` });
    return;
  }
  await next();
};

export default staticServe;
