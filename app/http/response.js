const stream = require('stream');

const CRLF = "\r\n";
const STATUS_CODE = {
  200: 'OK',
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

  _buildResponseData() {
    const responseArray = [`HTTP/1.1 ${this.statusCode} ${STATUS_CODE[this.statusCode]}`];
    const headerKeys = Object.keys(this.headers);
    if (headerKeys.length > 0) {
      headerKeys
        .forEach((key) => {
          responseArray.push(`${key.toLowerCase()}: ${this.headers[key]}`);
        });
    }
    responseArray.push(`${CRLF}${this.bodyData ?? ''}`);
    return responseArray.join(CRLF);
  }

  status(code) {
    this.statusCode = code
    return this;
  }

  body(data) {
    this.setHeader('content-length', Buffer.byteLength(data));
    this.bodyData = data;
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  end() {
    this._socket.end(this._buildResponseData());
  }
}

module.exports = HttpResponse;