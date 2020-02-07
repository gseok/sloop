/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');

const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');

const hotMiddlewareScript = `webpack-hot-middleware/client?name=web&path=/__webpack_hmr&timeout=20000&reload=true`;

const rootPath = path.resolve(__dirname, '..', '..');
const DEFAULT_MODE = 'development';
const PRODUCTION_MODE = 'production';

const getEntry = (target) => {
  return target === 'node'
    ? [path.resolve(rootPath, 'src/client/App.tsx')]
    : [hotMiddlewareScript, path.resolve(rootPath, 'src/client/index.tsx')];
}

const getConfig = (target, env) => {
  const { NODE_ENV = DEFAULT_MODE, GENERATE_SOURCEMAP = '' } = env;

  return {
    target,
    name: target,

    mode: NODE_ENV === DEFAULT_MODE || NODE_ENV === PRODUCTION_MODE ? NODE_ENV : DEFAULT_MODE,
    devtool: GENERATE_SOURCEMAP,

    entry: getEntry(target),
    output: {
      path: path.resolve(rootPath, 'dist/client', target),
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name].js',
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
          ],
        },
        // {
        //   test: /\.module\.(scss|sass)$/,
        //   use: [
        //     { loader: 'style-loader' }, // to inject the result into the DOM as a style block
        //     { loader: 'css-modules-typescript-loader' }, // to generate a .d.ts module next to the .scss file (also requires a declaration.d.ts with "declare modules '*.scss';" in it to tell TypeScript that "import styles from './styles.scss';" means to load the module "./styles.scss.d.td")
        //     { loader: 'css-loader', options: { modules: true } }, // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
        //     { loader: 'resolve-url-loader' },
        //     { loader: 'sass-loader' }, // to convert SASS to CSS
        //   ],
        // },
      ],
    },

    resolve: {
      extensions: ['.js', 'jsx', '.ts', '.tsx'], // '.css', '.scss'],
    },

    plugins:
      target === 'node' ? [new LoadablePlugin()] : [new LoadablePlugin(), new webpack.HotModuleReplacementPlugin()],

    externals: target === 'node' ? ['@loadable/component', nodeExternals()] : undefined,
  };
};

module.exports = (env) => {
  return [getConfig('web', env), getConfig('node', env)];
};
