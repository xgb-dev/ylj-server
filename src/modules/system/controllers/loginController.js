const loginService = require('../services/loginService');
const { success, error } = require('../../../utils/response');
const { generateToken } = require('../../../utils/auth');

class LoginController{
  /**
   * 用户登录
   */
  
  async login(req, res) {
    console.log(this)
    try {
      const { username, password } = req.body;
      // 参数验证
      if (!username || !password) {
        res.status(400).json(error('用户名和密码不能为空'));
        // return this.sendError(res, '用户名和密码不能为空');
      }

      // 验证用户
      const user = await loginService.validateUser(username, password);
      
      // 生成token
      const token = generateToken(user);

      res.status(200).json(success({ token }, '登录成功'));
      // this.sendSuccess(res, {token}, '登录成功');
    } catch (err) {
      // this.sendError(res, err);
      res.status(500).json(error(err));
    }
  }

  /**
   * 获取用户信息
   */
  async getInfo(req, res) {
    try {
      const data = await loginService.getUserInfo(req.query.id);
      res.json(data);
    } catch (err) {
      res.status(500).json(error(err));
    }
  }

  /**
   * 用户退出
   */
  async logout(req, res) {
    try {
      // 这里可以添加token黑名单等逻辑
      res.json(success('退出成功'));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }
}

module.exports = new LoginController();