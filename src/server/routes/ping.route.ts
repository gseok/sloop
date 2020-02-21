import { Context } from 'koa';

const getPing = (ctx: Context) => {
  ctx.body = {
    url: '/ping',
    greeting: 'Hello sloop project koa server !!!',
  };
};

export default getPing;
