const userService = require('../services/userService');
const { success, error } = require('../../../utils/response');
const { validateUser } = require('../dto/userDto');

class UserController {
  /**
   * 创建用户
   */
  async create(req, res) {
    try {
      const { error: validationError } = validateUser(req.body);
      if (validationError) {
        return res.status(400).json(error(validationError.details[0].message));
      }

      const user = await userService.create(req.body, req.user.username);
      res.json(success('用户创建成功', user));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 更新用户
   */
  async update(req, res) {
    try {
      const { error: validationError } = validateUser(req.body, true);
      if (validationError) {
        return res.status(400).json(error(validationError.details[0].message));
      }

      const user = await userService.update(req.params.id, req.body, req.user.username);
      res.json(success('用户更新成功', user));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 删除用户
   */
  async delete(req, res) {
    try {
      const ids = req.params.ids.split(',').map(Number);
      await userService.delete(ids);
      res.json(success('用户删除成功'));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取用户列表
   */
  async list(req, res) {
    try {
      const data = await userService.findList(req.query);
      res.json(success('获取成功', data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取用户详情
   */
  async getInfo(req, res) {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json(error('用户不存在'));
      }
      res.json(success('获取成功', user));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取用户详情
   */
  async getUserInfo(req, res) {
    try {
      const user = await userService.getUserInfo(req.params.id);
      if (!user) {
        return res.status(404).json(error('用户不存在'));
      }
      res.json(success('获取成功', user));
    } catch (err) {
      res.status(500).json(error(err));
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(req, res) {
    try {
      await userService.resetPassword(
        req.params.id, 
        req.body.password,
        req.body.username
      );
      res.json(success('密码重置成功'));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 更新用户状态
   */
  async updateStatus(req, res) {
    try {
      await userService.updateStatus(
        req.params.id,
        req.body.status,
        req.user.username
      );
      res.json(success('状态更新成功'));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }
}

module.exports = new UserController(); 