const { HTTP_STATUS_UNAUTHORIZED } = require('http2').constants; // 401

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
