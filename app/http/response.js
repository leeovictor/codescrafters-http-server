const http = require('http')

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

  _buildHeadersGroup(headersMap) {
    if (
        !headersMap ||
        Object.keys(headersMap).length === 0
    ){
      return '';
    }
    
    return Object.keys(headersMap)
      .map(key => `${key}: ${headersMap[key]}\r\n`)
      .join('');
  }

  writeHead(status, headers) {
    const statusLine = `HTTP/1.1 ${status} ${http.STATUS_CODES[status]}\r\n`;
    const headersData = this._buildHeadersGroup({ ...headers, ...this.headers });
    this._socket.write(statusLine + headersData + '\r\n'); 
    return this;
  }

  write(buffer) {
    this._socket.write(buffer);
  }
  
  end(buffer) {
    this._socket.end(buffer);
  }
}

module.exports = HttpResponse;