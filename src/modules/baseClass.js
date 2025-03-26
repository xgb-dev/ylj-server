const { successFilter, errorFilter, success, error } = require('../utils/response');
class BaseClass {
  constructor() {
    this.ok = successFilter;
    this.no = errorFilter;
    this.ajaxOk = success;
    this.ajaxNo = error;
  }
  // 可以添加一些通用的辅助方法
  sendSuccess(res, data = null, message = 'Success', status = 200) {
    return res.status(status).json(this.ajaxOk(data, message));
  }

  sendError(res, message = 'Error', status = 500) {
    return res.status(status).json(this.ajaxNo(message, status));
  }
}
module.exports = BaseClass;