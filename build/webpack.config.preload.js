const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');

const baseConfig = require('./webpack.config.base');

const env = process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = merge(baseConfig, {
  mode: env,
  target: 'electron-preload',
  entry: {
    preload: path.resolve(__dirname, '..', 'app', 'preload', 'index.ts'),
  },
  optimization: {
    namedModules: true,
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: env,
    }),
  ],
});
