import Koa from 'koa';
import commonErrorHandler from './middlewares/commonErrorHandler';
import pageNotFound from './middlewares/pageNotFound';
import router from './routes';

const app: Koa = new Koa();

app.use(commonErrorHandler);
app.use(pageNotFound);

// route
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
