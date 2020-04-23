/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');

const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const hotMiddlewareScript = `webpack-hot-middleware/client?name=web&path=/__webpack_hmr&timeout=20000&reload=true`;

const rootPath = path.resolve(__dirname, '..', '..');
const DEFAULT_MODE = 'development';
const PRODUCTION_MODE = 'production';

const getEntry = ({ target, mode, useHash, useLoadable }) => {
  if (target === 'node') {
    return [path.resolve(rootPath, `src/client/App${!useLoadable ? 'NotLoadable' : ''}.tsx`)];
  }

  if (mode === DEFAULT_MODE && !useHash) {
    return [hotMiddlewareScript, path.resolve(rootPath, `src/client/index${!useLoadable ? 'NotLoadable' : ''}.tsx`)];
  }
  return [path.resolve(rootPath, `src/client/index${!useLoadable ? 'NotLoadable' : ''}.tsx`)];
};

const getConfig = (target, env) => {
  const {
    NODE_ENV = DEFAULT_MODE,
    GENERATE_SOURCEMAP = '',
    GENERATE_SOURCE_NAME = 'normal',
    GENERATE_STYLE = 'inline',
    SSR_TYPE = 'stream',
    USE_LOADABLE,
    USE_REDUX_DEV_TOOLS,
    useLoadable,
    useReduxDevTools,
    phase,
  } = env;

  const outputFileName = `[name]${GENERATE_SOURCE_NAME === 'hash' ? '.[hash]' : ''}.js`;
  const outputStyleFileName = `[name]${GENERATE_SOURCE_NAME === 'hash' ? '.[hash]' : ''}.css`;

  return {
    target,
    name: target,

    mode: NODE_ENV === DEFAULT_MODE || NODE_ENV === PRODUCTION_MODE ? NODE_ENV : DEFAULT_MODE,
    devtool: GENERATE_SOURCEMAP,

    entry: getEntry({
      target,
      mode: NODE_ENV,
      useHash: GENERATE_SOURCE_NAME === 'hash',
      useLoadable: USE_LOADABLE === 'on' || useLoadable === 'on',
    }),
    output: {
      path: path.resolve(rootPath, 'dist/client', target),
      publicPath: '/',
      filename: outputFileName,
      chunkFilename: outputFileName,
      libraryTarget: target === 'node' ? 'commonjs2' : undefined,
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(rootPath, 'src/client/tsconfig.json'),
              },
            },
            {
              loader: 'string-replace-loader',
              options: {
                multiple: [
                  { search: 'CURRENT_PHASE', replace: phase },
                  { search: 'USE_REDUX_DEV_TOOLS', replace: USE_REDUX_DEV_TOOLS || useReduxDevTools || 'false' },
                ],
              },
            },
            (() => {
              if (phase !== 'real') return null;
              return {
                loader: 'webpack-strip-block',
                options: {
                  start: 'develblock:start',
                  end: 'develblock:end',
                },
              };
            })(),
          ].filter((data) => !!data),
        },
        {
          test: /\.module\.(scss|sass)$/,
          use: [
            (() => {
              if (target === 'web' && (GENERATE_STYLE === 'inline' || SSR_TYPE === 'stream')) {
                return { loader: 'style-loader' }; // to inject the result into the DOM as a style block
              }

              return {
                loader: MiniCssExtractPlugin.loader,
              };
            })(),
            {
              loader: 'css-loader',
              options: { importLoaders: 1, modules: true },
            }, // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
            { loader: 'resolve-url-loader' },
            { loader: 'sass-loader' }, // to convert SASS to CSS
          ].filter((data) => !!data),
        },
      ],
    },

    resolve: {
      extensions: ['.js', 'jsx', '.ts', '.tsx', '.css', '.scss'],
    },

    plugins: (() => {
      if (target === 'node') {
        return [new MiniCssExtractPlugin({ filename: outputStyleFileName }), new LoadablePlugin()];
      }

      // target === 'web'
      if (NODE_ENV === DEFAULT_MODE) {
        return [
          new MiniCssExtractPlugin({ filename: outputStyleFileName }),
          new LoadablePlugin(),
          new webpack.HotModuleReplacementPlugin(),
        ];
      }
      return [new MiniCssExtractPlugin({ filename: outputStyleFileName }), new LoadablePlugin()];
    })(),

    externals: target === 'node' ? ['@loadable/component', nodeExternals()] : undefined,
  };
};

module.exports = (env) => {
  return [getConfig('web', env), getConfig('node', env)];
};
