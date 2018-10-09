const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: {
    analytics: './src/app/analytics.js',
    app: './src/app',
  },
  output: {
    filename: 'js/[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(['build', 'dist'], {
      root: path.join(__dirname, '../'),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css',
    }),
    new StyleLintPlugin({
      reporters: [{ formatter: 'string', console: true }],
    }),
    new CopyWebpackPlugin([
      { from: './src/img', to: 'img' },
      { from: './src/root', to: '' },
      { from: './src/db', to: 'db' },
    ]),
    new WriteFilePlugin(),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
            },
          },
        ],
        include: path.join(__dirname, '../src'),
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        include: path.join(__dirname, '../src'),
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
        include: path.join(__dirname, '../src'),
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue: 'vue/dist/vue.common.js',
      '@': path.resolve(__dirname, '../src/app/'),
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'app',
          test: /\.(sa|sc|c)ss$/,
          chunks: 'all',
          enforce: false,
        },
      },
    },
  },
};
