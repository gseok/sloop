/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootPath = path.resolve(__dirname, '..', '..');
const DEFAULT_MODE = 'development';
const PRODUCTION_MODE = 'production';

module.exports = (env) => {
  const { NODE_ENV = DEFAULT_MODE, GENERATE_SOURCEMAP = '' } = env;

  return {
    mode: NODE_ENV === DEFAULT_MODE || NODE_ENV === PRODUCTION_MODE ? NODE_ENV : DEFAULT_MODE,
    devtool: GENERATE_SOURCEMAP,

    entry: path.resolve(rootPath, 'src/client/index.tsx'),
    output: {
      path: path.resolve(rootPath, 'dist/client'),
      filename: '[name].js',
      chunkFilename: '[name].js',
    },

    devServer: {
      publicPath: '/',
      port: 3000,
      hot: true,
      open: true,
      inline: true,
      disableHostCheck: true,
      historyApiFallback: true,
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                customize: require.resolve('babel-preset-react-app'),
              },
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(rootPath, 'src/client/tsconfig.json'),
              },
            },
          ],
        },
        {
          test: /\.module\.(scss|sass)$/,
          use: [
            { loader: 'style-loader' }, // to inject the result into the DOM as a style block
            // { loader: 'css-modules-typescript-loader' }, // to generate a .d.ts module next to the .scss file (also requires a declaration.d.ts with "declare modules '*.scss';" in it to tell TypeScript that "import styles from './styles.scss';" means to load the module "./styles.scss.d.td")
            { loader: 'css-loader', options: { modules: true } }, // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
            { loader: 'resolve-url-loader' },
            { loader: 'sass-loader' }, // to convert SASS to CSS
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.js', 'jsx', '.ts', '.tsx', '.css', '.scss'],
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(rootPath, 'public/index.html'),
      }),
    ],
  };
};
