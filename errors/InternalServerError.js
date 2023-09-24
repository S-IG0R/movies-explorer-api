const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants; // 500

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
