class ApiResponse {
  static success(data = null, message = 'Success', status = 0) {
    return {
      success: true,
      message,
      data,
      code: status
    };
  }

  static error(message, status = 500) { 
    return {
      success: false,
      message: typeof message == 'object'?message.message: message,
      code: status
    };
  }

  static successFilter({message, status = 200, data = null}) {
    return {
      message,
      code: status,
      data
    };
  }
  static errorFilter(message) {
    if(typeof message == 'object') {
      throw new Error(message.message);
    }
    throw new Error(message);
  }
}

module.exports = ApiResponse;