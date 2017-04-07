const webpack = require('webpack');
const config = require('./config/webpack/dev.js')({ env: 'dev' });
const compiler = webpack(config);
const webpackDevServer = require('webpack-dev-server');
const API_URL = 'http://localhost:' + (process.env.API_PORT || 3000);
const port = process.env.PORT || 8080;

const server = new webpackDevServer(compiler, {
  contentBase: config.context,
  hot: true,
  inline: true,
  port: port,
  historyApiFallback: true,
  proxy: {
    '/api': {
      target: API_URL,
      secure: false
    }
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
});

server.listen(port, () => {
  console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
});
