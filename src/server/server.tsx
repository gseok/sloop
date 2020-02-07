/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable no-console */
import path from 'path';
import Koa, { Middleware, Context } from 'koa';
import React from 'react';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
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

  const e2k = require('express-to-koa');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const compiler = webpack(webpackConfig);

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
const ssr: Middleware = async (ctx: Context) => {
  const nodeStats = path.resolve(__dirname, '../client/node/loadable-stats.json');
  const webStats = path.resolve(__dirname, '../client/web/loadable-stats.json');
  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const { default: App } = nodeExtractor.requireEntrypoint();
  const webExtractor = new ChunkExtractor({ statsFile: webStats });

  const jsx = webExtractor.collectChunks(
    <StaticRouter location={ctx.url} context={ctx}>
      <App />
    </StaticRouter>,
  );

  const html = renderToString(jsx);

  console.log('ssr string >', html);
  ctx.body = `
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <meta name="google" content="notranslate" />
        ${webExtractor.getLinkTags()}
        ${webExtractor.getStyleTags()}
      </head>
      <body>
        <!-- ssr rendering...!!! -->
        <div id="root">${html}</div>
        ${webExtractor.getScriptTags()}
      </body>
    </html>
  `;
};
app.use(ssr);

// not supported route then show up page not found
app.use(pageNotFound);

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log('Press CTRL-C to stop');
});
