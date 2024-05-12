const net = require("net");
const fs = require('fs');
const fsPromises = require("fs/promises");
const { createHttpServer } = require('./http/server');

const PORT = 4221;
const app = createHttpServer();
const directory = process.argv[3];

app.get('/', (_, res) => res.writeHead(200).end());

app.get('/user-agent', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(req.headers['user-agent'])
  });
  res.end(req.headers['user-agent']);
});

app.get('/echo/:echoStr', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(req.params.echoStr)
  });
  res.end(req.params.echoStr);
});

app.get('/files/:fileName', (req, res) => {
  fs.readFile(`${directory}/${req.params.fileName}`, (err, fileData) => {
    if (err) {
      return res.writeHead(404).end();
    }
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileData.byteLength
    });
    res.end(fileData);
  })
});

app.post('/files/:fileName', (req, res) => {
  fs.writeFile(`${directory}/${req.params.fileName}`, req.body, (err) => {
    if (err) {
      return res.writeHead(500).end();
    }
    res.writeHead(201).end();
  })
});

app.listen(PORT, 'localhost', () => console.log(`server listenning on ${PORT}`));