const zlib = require('zlib');

const CRLF = "\r\n";
const STATUS_CODE = {
  200: 'OK',
  201: 'Created',
  404: 'Not Found',
  500: 'Internal Error'
};

class HttpResponse {
  constructor(socket) {
    this._socket = socket;
    this.statusCode = 200;
    this.headers = {};
    this.bodyData;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  writeHead(status, headersMap) {
    const statusLine = `HTTP/1.1 ${status} ${STATUS_CODE[status]}\r\n`;
    let groupA = '', groupB = '';
    if (Object.keys(this.headers).length > 0) {
      groupA = Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}\r\n`).join('');
    }
    if (headersMap) {
      groupB = Object.keys(headersMap).map(key => `${key}: ${headersMap[key]}\r\n`).join('');
    }
    const headers = groupA + groupB;
    this._socket.write(statusLine + headers + '\r\n');
    return this;
  }

  write(buffer) {
    this._socket.write(buffer);
  }
  
  end(data) {
    this._socket.end(data)
  }
}

module.exports = HttpResponse;