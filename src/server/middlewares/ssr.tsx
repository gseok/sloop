import path from 'path';
import { Middleware, Context } from 'koa';
import React from 'react';
import { StaticRouter } from 'react-router';
import { renderToNodeStream, renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import { useSSRStream } from '../setting';
import logger from '../helpers/logger';

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
      const afterTemplate = `</div>
          <script type="text/javascript">window.__INITIAL_DATA__ = ${JSON.stringify({})}</script>
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
          ${webExtractor.getScriptTags()}
        </body>
      </html>
    `;
    ctx.body = template;
  }
};

export default ssr;
