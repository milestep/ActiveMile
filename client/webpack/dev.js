const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./base.js');
const path = require('path');
const API_URL = `http://localhost:${process.env.API_PORT || 3000}`;
const port = process.env.PORT || 8080;

module.exports = function() {
  return webpackMerge(commonConfig(), {
    entry: [
      'babel-polyfill', 
      path.resolve(__dirname, '../src', 'client.js')
    ],
    devtool: 'inline-sourcemap',
    externals: {
      'app-config': JSON.stringify(require('./../config/dev.json'))
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        reload: true
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        }
      })
    ],
    devServer: {
      port: port,
      inline: true,
      proxy: [{
        context: ['/api', '/assets'],
        target: API_URL,
        secure: false
      }],
      historyApiFallback: {
        index: '/index.html'
      },
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      stats: {
        colors: true,
        hash: true,
        chunks: true,
        chunkModules: false,
        modules: false
      }
    }
  });
};
