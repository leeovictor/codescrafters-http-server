class Response {
  constructor() {
    this._headers = [];
    this.CRLF = "\r\n";
    this.STATUS_MESSAGES = {
      200: 'OK',
      404: 'Not Found'
    }
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  header(key, value) {
    this._headers.push(`${key}: ${value}`);
    return this;
  }

  body(data) {
    this.bodyContent = data;
    return this;
  }
  
  value() {
    const responseArray = [];
    responseArray.push(`HTTP/1.1 ${this.statusCode} ${this.STATUS_MESSAGES[this.statusCode]}`);
    if (this._headers.length > 0) {
      this._headers.forEach(header => responseArray.push(header));
    }
    responseArray.push(`${this.CRLF}${this.bodyContent ?? ''}`);
    return responseArray.join(this.CRLF);
  }
}

module.exports = Response;