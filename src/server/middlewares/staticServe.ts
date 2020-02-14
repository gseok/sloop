import { Middleware, Context, Next } from 'koa';
import send from 'koa-send';
import logger from '../helpers/logger';

const staticServe: Middleware = async (ctx: Context, next: Next) => {
  logger.info('req > ', ctx.path, __dirname);
  if (ctx.path.includes('.css') || ctx.path.includes('.js')) {
    await send(ctx, ctx.path, { root: `${__dirname}/../client/web` });
    return;
  }
  next();
};

export default staticServe;
