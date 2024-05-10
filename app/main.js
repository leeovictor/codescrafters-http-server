const net = require("net");
const Response = require('./Response');
const PORT = 4221;

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
  const lines = data.toString().split('\r\n');
  const [startLine, ...headersLines] = lines;
  
  const [method, path, protocol] = startLine.split(' ');
  const headers =  headersParser(headersLines);
  
  return { method, path, protocol, headers };
}


const server = net.createServer((socket) => {
  socket.on('data', (data) => {
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
    } else {
      socket.end(res.status(404).value());
    }
  });
});

server.listen({ port: PORT, hostname: 'localhost' }, () => {
  console.log(`Server listenning on port ${PORT}`)
});
