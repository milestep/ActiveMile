const webpack = require('webpack');
const config = require('./client/webpack/dev.js')({ env: 'dev' });
const compiler = webpack(config);
const webpackDevServer = require('webpack-dev-server');
const API_URL = 'http://localhost:' + (process.env.API_PORT || 3000);
const port = process.env.PORT || 8080;

const server = new webpackDevServer(compiler, {
  contentBase: config.context,
  hot: true,
  inline: true,
  port: port,
  proxy: {
    '/api': {
      target: API_URL,
      secure: false
    }
  },
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
    progress: true,
    chunks: true,
    chunkModules: false,
    modules: false
  }
}).listen(port, 'localhost', (err, res) => {
  if (err) return console.error(err);
  console.info("==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
});
