/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const rootPath = path.resolve(__dirname, '..', '..');
const DEFAULT_MODE = 'development';
const PRODUCTION_MODE = 'production';

module.exports = (env) => {
  const { NODE_ENV = DEFAULT_MODE, GENERATE_SOURCEMAP = '', SSR_TYPE = 'stream', LOG_LEVEL = 'error', phase } = env;

  return {
    mode: NODE_ENV === DEFAULT_MODE || NODE_ENV === PRODUCTION_MODE ? NODE_ENV : DEFAULT_MODE,
    devtool: GENERATE_SOURCEMAP,
    // watch: BUILD_WATCH === 'on',

    target: 'node',
    node: {
      __dirname: false,
    },

    entry: {
      server: path.resolve(rootPath, 'src/server/server.tsx'),
    },
    output: {
      path: path.resolve(rootPath, 'dist/server'),
      filename: '[name].js',
      chunkFilename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            'babel-loader',
            'ts-loader',
            {
              loader: 'string-replace-loader',
              options: {
                multiple: [
                  { search: 'SSR_STREAM', replace: SSR_TYPE === 'stream' ? 'stream' : '' },
                  { search: 'CURRENT_PHASE', replace: phase },
                  { search: 'LOG_LEVEL', replace: LOG_LEVEL, flags: 'g' },
                ],
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
    },

    externals: [nodeExternals()],
  };
};
