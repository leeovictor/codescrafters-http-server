const net = require("net");
const PORT = 4221;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const dataStr = data.toString();
    const lines = dataStr.split("\r\n");
    const url = lines[0].split(' ')[1];
    if (url !== '/') {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
    } else {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    socket.end();
  });
});

server.listen({ port: PORT, hostname: 'localhost' }, () => {
  console.log(`Server listenning on port ${PORT}`)
});
