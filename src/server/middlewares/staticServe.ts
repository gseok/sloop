import { Middleware, Context, Next } from 'koa';
import send from 'koa-send';

const staticServe: Middleware = async (ctx: Context, next: Next) => {
  console.log('req > ', ctx.path, __dirname);
  if (ctx.path.includes('.css') || ctx.path.includes('.js')) {
    await send(ctx, ctx.path, { root: `${__dirname}/../client/web` });
    return;
  }
  next();
};

export default staticServe;
