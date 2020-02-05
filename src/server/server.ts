/* eslint-disable no-console */
import Koa from 'koa';
import commonErrorHandler from './middlewares/commonErrorHandler';
import pageNotFound from './middlewares/pageNotFound';
import router from './routes';

const PORT = 3131;
const app: Koa = new Koa();

// server main error handler
app.use(commonErrorHandler);

// route
app.use(router.routes()).use(router.allowedMethods());

// not supported route then show up page not found
app.use(pageNotFound);

app.listen(PORT);
console.log(`Server is running at http://127.0.0.1:${PORT}`);
console.log('Press CTRL-C to stop');
