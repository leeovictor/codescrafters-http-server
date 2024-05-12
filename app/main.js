const net = require("net");
const fs = require('fs');
const fsPromises = require("fs/promises");
const { createHttpServer } = require('./http/server');

const PORT = 4221;
const app = createHttpServer();
const directory = process.argv[3];

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

app.get('/files/:fileName', (req, res) => {
  fs.readFile(`${directory}/${req.params.fileName}`, (err, data) => {
    if (err) {
      return res.status(404).end();
    }
    res.setHeader('content-type', 'application/octet-stream');
    res.body(data);
    res.end();
  })
});

app.post('/files/:fileName', (req, res) => {
  fs.writeFile(`${directory}/${req.params.fileName}`, req.body, (err) => {
    if (err) {
      return res.status(500).end();
    }
    res.status(201).end();
  })
});

app.listen(PORT, 'localhost', () => console.log(`server listenning on ${PORT}`));