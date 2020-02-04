import Router from 'koa-router';

const router = new Router();

router.get('/ping', (ctx) => {
  ctx.body = {
    url: '/ping',
    greeting: 'Hello sloop project koa server',
  };
});

export default router;
