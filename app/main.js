const net = require("net");
const fs = require('fs');
const fsPromises = require("fs/promises");
const { createHttpServer } = require('./http/server');

const PORT = 4221;
const app = createHttpServer();

app.get('/', (_, res) => res.end());
app.get('/user-agent', (req, res) => {
  res.body(req.headers['user-agent'])
  res.setHeader('content-type', 'text/plain')
  res.end();
});
app.get('/echo/:echoStr', (req, res) => {
  res.setHeader('content-type', 'text/plain');
  res.body(req.params.echoStr);
  res.end()
});

app.listen(PORT, 'localhost', () => console.log(`server listenning on ${PORT}`));