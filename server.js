const express = require('express');
const path = require('path');
const http = require('http');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;
const API_URL = 'http://localhost:' + (process.env.API_PORT || '3000');

app.use('/api', proxy({
  target: API_URL,
  changeOrigin: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const server = http.createServer(app);
server.listen(port, () => {
  console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
});
