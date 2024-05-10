const net = require("net");
const fs = require('fs');
const fsPromises = require("fs/promises");
const Response = require('./Response');
const PORT = 4221;

console.log(process.argv[3]);

const headersParser = (headersLines) => headersLines
  .filter(value => Boolean(value))
  .reduce((acc, cur) => {
    const index = cur.indexOf(':');
    const key = cur.substring(0, index).trim();
    const value = cur.substring(index + 1).trim();
    acc[key] = value;
    return acc;
  }, {});

const requestParser = (data) => {
  const [startAndHeaders, body] = data.toString().split('\r\n\r\n');
  const [requestLine, ...headersLines] = startAndHeaders.split('\r\n');
  
  const [method, path, protocol] = requestLine.split(' ');
  const headers =  headersParser(headersLines);
  
  return { method, path, protocol, headers, body };
}

const server = net.createServer((socket) => {
  socket.on('data', async (data) => {
    const request = requestParser(data);
    console.log(request);
    
    const res = new Response();
    if (request.path === '/') {
      socket.end(
        res.status(200).value()
      );
    } else if (/^\/echo\/[^/]+$/.test(request.path)) {
      
      const echoStr = request.path.split('/')[2];
      res
        .status(200)
        .header('Content-Type', 'text/plain')
        .header('Content-Length', Buffer.byteLength(echoStr))
        .body(echoStr);
        
      socket.end(res.value());
      
    } else if (request.path === '/user-agent') {
      res
        .status(200)
        .header('Content-Type', 'text/plain')
        .header('Content-Length', Buffer.byteLength(request.headers['User-Agent']))
        .body(request.headers['User-Agent']);

      socket.end(res.value());
    } else if (/^\/files\/[^/]+$/.test(request.path)) {
      const fileName = request.path.split('/')[2];
      
      const fileDir = process.argv[3];
      const filePath = `${fileDir}/${fileName}`;
      if (fs.existsSync(filePath)) {
        const buffer = await fsPromises.readFile(`${fileDir}/${fileName}`);
        res
          .status(200)
          .header('Content-Type', 'application/octet-stream')
          .header('Content-Length', buffer.length)
          .body(buffer.toString());
      } else {
        res.status(404);
      }
      
      socket.end(res.value());
    } else {
      socket.end(res.status(404).value());
    }
  });
});

server.listen({ port: PORT, hostname: 'localhost' }, () => {
  console.log(`Server listenning on port ${PORT}`)
});
