const roleService = require('../services/roleService');
const { success, error } = require('../../../utils/response');
const { validateRole } = require('../dto/roleDto');

class RoleController {
  /**
   * 创建角色
   */
  async create(req, res) {
    try {
      const { error: validationError } = validateRole(req.body);
      if (validationError) {
        return res.status(400).json(error(validationError.details[0].message));
      }

      const role = await roleService.create(req.body, req.user.username);
      res.json(success('角色创建成功', role));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 更新角色
   */
  async update(req, res) {
    try {
      const { error: validationError } = validateRole(req.body, true);
      if (validationError) {
        return res.status(400).json(error(validationError.details[0].message));
      }

      const role = await roleService.update(req.params.id, req.body, req.user.username);
      res.json(success('角色更新成功', role));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 删除角色
   */
  async delete(req, res) {
    try {
      const ids = req.params.ids.split(',').map(Number);
      await roleService.delete(ids);
      res.json(success('角色删除成功'));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取角色列表
   */
  async list(req, res) {
    try {
      const data = await roleService.findList(req.query);
      res.json(success('获取成功', data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取角色详情
   */
  async getInfo(req, res) {
    try {
      const role = await roleService.findById(req.params.id);
      if (!role) {
        return res.status(404).json(error('角色不存在'));
      }
      res.json(success('获取成功', role));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 更新角色状态
   */
  async updateStatus(req, res) {
    try {
      await roleService.updateStatus(
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

module.exports = new RoleController(); 