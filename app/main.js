const net = require("net");
const PORT = 4221;

const requestParser = (data) => {
  const lines = data.toString().split('\r\n');
  const [startLine, ...headersLines] = lines;
  const [method, path, protocol] = startLine.split(' ');
  
  const headers = headersLines
    .filter(value => Boolean(value))
    .reduce((acc, cur) => {
      const colonIndex = cur.indexOf(':');
      const headerName = cur.substring(0, colonIndex);
      const headerValue = cur.substring(colonIndex).replace(': ', '').trim(); // FIX
      acc[headerName] = headerValue;
      return acc;
    }, {});
  
  return { method, path, protocol, headers };
}

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const request = requestParser(data);
    console.log(request);

    if (request.path === '/') {
      socket.end("HTTP/1.1 200 OK\r\n\r\n");
    } else if (/^\/echo\/[^/]+$/.test(request.path)) {
      const echoStr = request.path.split('/')[2];
      const length = Buffer.byteLength(echoStr)
      socket.end(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${length}\r\n\r\n${echoStr}`);
    } else if (request.path === '/user-agent') {
      const userAgent = request.headers['User-Agent'];
      const length = Buffer.byteLength(userAgent)
      socket.end(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${length}\r\n\r\n${userAgent}`);
    } else {
      socket.end("HTTP/1.1 404 Not Found\r\n\r\n")
    }
  });
});

server.listen({ port: PORT, hostname: 'localhost' }, () => {
  console.log(`Server listenning on port ${PORT}`)
});
