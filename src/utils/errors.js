class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = '资源未找到') {
    super(message, 404);
  }
}

class ForbiddenError extends AppError {
  constructor(message = '访问被拒绝') {
    super(message, 403);
  }
}

class ValidationError extends AppError {
  constructor(message = '数据验证失败') {
    super(message, 400);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ForbiddenError,
  ValidationError
};