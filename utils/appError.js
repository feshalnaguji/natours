class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // calling parent class/constructor

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // function call won't appear in stack trace
  }
}

module.exports = AppError;
