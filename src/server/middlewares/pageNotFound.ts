import { Context } from 'koa';

const pageNotFound = async (ctx: Context) => {
  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      ctx.body = {
        message: 'Page Not Found',
      };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
};

export default pageNotFound;
