import { Middleware, Context, Next } from 'koa';
import send from 'koa-send';

const staticServe: Middleware = async (ctx: Context, next: Next) => {
  console.log('hwi.........>>>>', ctx.path);
  if (ctx.path.includes('.css')) {
    send(ctx, ctx.path, { root: `${__dirname}/../client/node` });
    return;
  }
  next();
};

export default staticServe;
