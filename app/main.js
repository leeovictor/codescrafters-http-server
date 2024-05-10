const net = require("net");
const PORT = 4221;

const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });

  socket.write("HTTP/1.1 200 OK\r\n\r\n");
  socket.end();
});

server.listen({ port: PORT, hostname: 'localhost' }, () => {
  console.log(`Server listenning on port ${PORT}`)
});
