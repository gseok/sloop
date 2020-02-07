/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootPath = path.resolve(__dirname, '..', '..');
const DEFAULT_MODE = 'development';
const PRODUCTION_MODE = 'production';

module.exports = (env) => {
  const { NODE_ENV = DEFAULT_MODE, GENERATE_SOURCEMAP = '', BUILD_WATCH = 'off' } = env;

  return {
    mode: NODE_ENV === DEFAULT_MODE || NODE_ENV === PRODUCTION_MODE ? NODE_ENV : DEFAULT_MODE,
    devtool: GENERATE_SOURCEMAP,
    watch: BUILD_WATCH === 'on',

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
          use: ['babel-loader', 'ts-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
    },

    externals: [nodeExternals()],

    plugins: [new CleanWebpackPlugin()],
  };
};
