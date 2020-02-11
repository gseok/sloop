import { Middleware, Context, Next } from 'koa';
import send from 'koa-send';

const staticServe: Middleware = async (ctx: Context, next: Next) => {
  console.log('req > ', ctx.path, __dirname);
  if (ctx.path.includes('.css') || ctx.path.includes('.js')) {
    console.log('css or js req >');
    await send(ctx, ctx.path, { root: `${__dirname}/../client/node` });
    return;
  }
  next();
};

export default staticServe;
