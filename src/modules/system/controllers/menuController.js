const menuService = require('../services/menuService');
const { success, error } = require('../../../utils/response');
const { validateMenu } = require('../dto/menuDto');

class MenuController {
  /**
   * 创建菜单
   */
  async create(req, res) {
    try {
      const { error: validationError } = validateMenu(req.body);
      if (validationError) {
        return res.status(400).json(error(validationError.details[0].message));
      }

      const menu = await menuService.create(req.body, req.user.username);
      res.json(success('菜单创建成功', menu));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 更新菜单
   */
  async update(req, res) {
    try {
      const { error: validationError } = validateMenu(req.body, true);
      if (validationError) {
        return res.status(400).json(error(validationError.details[0].message));
      }

      const menu = await menuService.update(req.params.id, req.body, req.user.username);
      res.json(success('菜单更新成功', menu));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 删除菜单
   */
  async delete(req, res) {
    try {
      await menuService.delete(req.params.id);
      res.json(success('菜单删除成功'));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取菜单列表
   */
  async list(req, res) {
    try {
      const data = await menuService.findList(req.query);
      res.json(success('获取成功', data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取菜单详情
   */
  async getInfo(req, res) {
    try {
      const menu = await menuService.findById(req.params.id);
      if (!menu) {
        return res.status(404).json(error('菜单不存在'));
      }
      res.json(success('获取成功', menu));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取菜单树结构
   */
  async treeselect(req, res) {
    try {
      const data = await menuService.getTree();
      res.json(success('获取成功', data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取角色菜单树
   */
  async roleMenuTreeselect(req, res) {
    try {
      const data = await menuService.getRoleMenuTree(req.params.roleId);
      res.json(success('获取成功', data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取用户菜单权限
   */
  async getUserMenus(req, res) {
    try {
      const data = await menuService.getUserMenus(req.user.id);
      res.json(success('获取成功', data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }
}

module.exports = new MenuController(); 