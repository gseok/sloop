import { Context, Next } from 'koa';
import getGeoCodeApi from '../api/getGeoCode.api';
import logger from '../helpers/logger';

const apiRoute = async (ctx: Context, next: Next) => {
  logger.info('api >>', ctx.path, ctx.query.phase);
  if (ctx.path.includes('/api/geocode')) {
    const res = await getGeoCodeApi(ctx.query.phase);
    ctx.body = { res };
    return;
  }

  next();
};

export default apiRoute;
