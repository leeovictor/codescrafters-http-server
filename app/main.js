const net = require("net");
const PORT = 4221;

const requestParser = (buffer) => {
  const lines = buffer.toString().split('\r\n');
  const [method, path, protocol] = lines[0].split(' ');
  return { method, path, protocol };
}

const server = net.createServer((socket) => {
  socket.on('data', (buffer) => {
    const request = requestParser(buffer);
    console.log(request)

    if (request.path === '/') {
      socket.end("HTTP/1.1 200 OK\r\n\r\n");
    } else if (/^\/echo\/[^/]+$/.test(request.path)) {
      const echoStr = request.path.split('/')[2];
      const length = Buffer.byteLength(echoStr)
      socket.end(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${length}\r\n\r\n${echoStr}`);
    } else {
      socket.end("HTTP/1.1 404 Not Found\r\n\r\n")
    }
  });
});

server.listen({ port: PORT, hostname: 'localhost' }, () => {
  console.log(`Server listenning on port ${PORT}`)
});
