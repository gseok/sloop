import path from 'path';
import { Middleware, Context } from 'koa';
import React from 'react';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';

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

export default ssr;
