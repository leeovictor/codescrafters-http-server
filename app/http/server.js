const net = require('net');
const pToRgx = require('path-to-regexp');
const HttpResponse = require('./response');

module.exports = { createHttpServer: () => new HttpServer() };

const headersParser = (headersLines) => headersLines
  .filter(value => Boolean(value))
  .reduce((acc, cur) => {
    const index = cur.indexOf(':');
    const key = cur.substring(0, index).trim();
    const value = cur.substring(index + 1).trim();
    acc[key.toLowerCase()] = value;
    return acc;
  }, {});

const requestParser = (data) => {
  const [startAndHeaders, body] = data.toString().split('\r\n\r\n');
  const [requestLine, ...headersLines] = startAndHeaders.split('\r\n');
  
  const [method, path, protocol] = requestLine.split(' ');
  const headers =  headersParser(headersLines);
  
  return { method, path, protocol, headers, body };
}

class HttpServer {
  constructor() {
    this._routes = [];
    this._tcpServer = net.createServer();

    this._tcpServer.on('connection', this._handleConnection.bind(this));
  }

  _handleConnection(socket) {
    socket.on('data', (data) => {
      const req = requestParser(data);
      const res = new HttpResponse(socket);
      
      for (const routeDefinition of this._routes) {
        if (routeDefinition.method === req.method && routeDefinition.regex.test(req.path)) {
          const result = routeDefinition.match(req.path);
          req.params = result.params;
          return routeDefinition.handler(req, res);
        }
      }
      
      res.status(404).end();
    });
  }

  _registerRoute(method, path, handler) {
    this._routes.push({
      method,
      name: path,
      match: pToRgx.match(path),
      regex: pToRgx.pathToRegexp(path),
      handler,
    });
  }

  get(path, handler) {
    this._registerRoute('GET', path, handler);
  }

  post(path, handler) {
    this._registerRoute('POST', path, handler);
  }

  listen(port, hostname, cb) {
    return this._tcpServer.listen({ port, hostname }, cb);
  }
}