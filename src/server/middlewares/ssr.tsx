/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path';
import { Middleware, Context, Next } from 'koa';
import React from 'react';
import { StaticRouter } from 'react-router';
import { renderToNodeStream, renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import appReducer from '../../shared/redux/reducers/reducers';
import { useSSRStream } from '../setting';
import logger from '../helpers/logger';

const ssr: Middleware = async (ctx: Context, next: Next) => {
  const nodeStats = path.resolve(__dirname, '../client/node/loadable-stats.json');
  const webStats = path.resolve(__dirname, '../client/web/loadable-stats.json');
  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const { default: App } = nodeExtractor.requireEntrypoint();
  const webExtractor = new ChunkExtractor({ statsFile: webStats });

  // redux for ssr
  logger.debug('Server Side Init Data: ', ctx.state);
  const store = createStore(appReducer, {
    Sample1Reducer: { number: ctx.state.serverFetchedData.number1 },
    Sample2Reducer: { number: ctx.state.serverFetchedData.number2 },
  });
  const preloadedState = store.getState(); // Grab the initial state from our Redux store

  const jsx = webExtractor.collectChunks(
    <Provider store={store}>
      <StaticRouter location={ctx.url} context={ctx}>
        <App />
      </StaticRouter>
    </Provider>,
  );

  const useStream = useSSRStream;

  if (useStream) {
    logger.log('SSR > stream.....');
    ctx.status = 200; // ssr response status
    ctx.respond = false; // use stream
    const htmlStream = renderToNodeStream(jsx);

    const beforeTemplate = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <meta name="google" content="notranslate" />
          ${webExtractor.getStyleTags()}
        </head>
        <body>
          <!-- ssr rendering...!!! -->
          <div id="root">`;

    ctx.res.write(beforeTemplate);
    htmlStream.pipe(ctx.res, { end: false });
    htmlStream.on('end', () => {
      const preLoadedStateStr = JSON.stringify(preloadedState).replace(/</g, '\\u003c');
      const afterTemplate = `</div>
          <script type="text/javascript">window.__INITIAL_DATA__ = ${JSON.stringify({})}</script>
          <script type="text/javascript">window.__PRELOADED_STATE__ = ${preLoadedStateStr}</script>
          ${webExtractor.getScriptTags()}
          </body>
        </html>
      `;
      ctx.res.write(afterTemplate);
      ctx.res.end();
    });
  } else {
    logger.log('SSR > string...!!!!!');
    const html = renderToString(jsx);
    const template = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <meta name="google" content="notranslate" />
          ${webExtractor.getStyleTags()}
          ${webExtractor.getLinkTags()}
        </head>
        <body>
          <!-- ssr rendering...!!! -->
          <div id="root">${html}</div>
          <script>
            // WARNING: See the following for security issues around embedding JSON in HTML:
            // https://redux.js.org/recipes/server-rendering/#security-considerations
            window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
          </script>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
    `;
    ctx.body = template;
    return;
  }

  await next();
};

export default ssr;
