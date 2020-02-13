/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable no-console */
import Koa from 'koa';
import staticServe from './middlewares/staticServe';
import ssr from './middlewares/ssr';
import commonErrorHandler from './middlewares/commonErrorHandler';
import pageNotFound from './middlewares/pageNotFound';
import router from './routes';
import { currentPhase } from './setting';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const PORT = 3131;
const app: Koa = new Koa();

// NOTE: client build for ssr when server local devlop time
if (process.env.NODE_ENV !== 'production') {
  console.log('Server started development!, Client build...');

  const webpack = require('webpack');
  const webpackConfig = require('../../scripts/build-scripts/webpack.config.client.js')({
    ...process.env,
    phase: currentPhase,
  });
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
app.use(ssr);

// not supported route then show up page not found
app.use(pageNotFound);

// server start
app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log('Press CTRL-C to stop');
});

// TODOS
// 1. real build시 extract한 css을 하나의 위치로 나오게 변경(build env optional로 구동되게함)
// 3. 서버 logger 도입 필요, 일단 logger로 만들고, Nelo는 차후 연결(별도이슈로)
// 5. 빌드 스크립트를 wrap 하여 좀더 간략하게 변경 필요 webpack을 programing형태로 구동
// 6. real의 css extract의 이름에 hash 추가 & css을 single file화 하는 방법 연구
