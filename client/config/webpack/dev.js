const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./base.js');

module.exports = function() {
  return webpackMerge(commonConfig(), {
    devtool: 'inline-sourcemap',
    externals: {
      'app-config': JSON.stringify(require('./../app/dev.json'))
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin({
        reload: true
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        }
      })
    ],
    devServer: {
      historyApiFallback: {
        index: '/index.html'
      }
    }
  });
};
