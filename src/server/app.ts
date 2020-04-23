/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable no-console */
import Koa from 'koa';
import staticServe from './middlewares/staticServe';
import ssr from './middlewares/ssr';
import ssrFetch from './middlewares/ssrFetch';
import commonErrorHandler from './middlewares/commonErrorHandler';
import pageNotFound from './middlewares/pageNotFound';
import router from './routes';
import { currentPhase, useLoadable, useReduxDevTools } from './setting';

const PORT = 3131;
const app: Koa = new Koa();

// NOTE: client build for ssr when server local devlop time
if (process.env.NODE_ENV === 'development') {
  console.log('Server started development!, Client build...');

  const appEnv = {
    ...process.env,
    phase: currentPhase,
    useLoadable,
    useReduxDevTools,
  };

  const webpack = require('webpack');
  const webpackConfigFn = require('../../scripts/build-scripts/webpack.config.client.js');
  const webpackConfig = webpackConfigFn(appEnv);
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

// static serve
app.use(staticServe);

// SSR setting
app.use(ssrFetch);
app.use(ssr);

// not supported route then show up page not found
app.use(pageNotFound);

export default app;
