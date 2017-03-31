const webpack = require('webpack');
const path = require('path');
const bootstrap = require('bootstrap-styl');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function() {
  return {
    context: path.join(__dirname, '/../../src'),
    entry: './client.js',
    output: {
      filename: '[name]-[hash].js',
      path: path.join(__dirname, '/../../dist'),
      publicPath: '/'
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        use: [
          'babel-loader'
          /*'eslint-loader'*/
        ],
        exclude: /(node_modules|bower_components)/
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader'],
        })
      }, {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'stylus-loader'],
        })
      }, {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        })
      }, {
        test: /(\.jpg$|\.png$)/,
        use: 'file-loader'
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      }]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),
      new webpack.LoaderOptionsPlugin({
        test: /(\.css$|\.sass$|\.styl$)/,
        options: {
          context: path.join(__dirname, 'src'),
          postcss:  [
            autoprefixer({
              browsers: ['last 10 versions']
            })
          ],
          stylus: { use: [bootstrap()] }
        }
      }),
      new HtmlWebpackPlugin({
        template: 'index.html',
        chunksSortMode: 'dependency'
      }),
      new ExtractTextPlugin({ 
        filename: '[name]-[hash].css', 
        allChunks: true 
      })
    ]
  };
};
