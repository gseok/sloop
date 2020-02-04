const getPing = (ctx) => {
  ctx.body = {
    url: '/ping',
    greeting: 'Hello sloop project koa server',
  };
};

export default getPing;
