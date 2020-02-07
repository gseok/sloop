/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable no-console */
import Koa from 'koa';
import ssr from './middlewares/ssr';
import commonErrorHandler from './middlewares/commonErrorHandler';
import pageNotFound from './middlewares/pageNotFound';
import router from './routes';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const PORT = 3131;
const app: Koa = new Koa();

// NOTE: client build for ssr when server local devlop time
if (process.env.NODE_ENV !== 'production') {
  console.log('Server started development!, Client build...');

  const webpack = require('webpack');
  const webpackConfig = require('../../scripts/build-scripts/webpack.config.client.js')(process.env);
  const compiler = webpack(webpackConfig);

  const e2k = require('express-to-koa');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  app.use(
    e2k(
      webpackDevMiddleware(compiler, {
        logLevel: 'silent',
        publicPath: webpackConfig[0].output.publicPath,
      }),
    ),
  );

  app.use(e2k(webpackHotMiddleware(compiler)));

  (async () => {
    const open = require('open');
    await open(`http://127.0.0.1:${PORT}`);
  })();
}

// server main error handler
app.use(commonErrorHandler);

// route for rest api
app.use(router.routes()).use(router.allowedMethods());

// SSR setting
app.use(ssr);

// not supported route then show up page not found
app.use(pageNotFound);

// server start
app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log('Press CTRL-C to stop');
});
