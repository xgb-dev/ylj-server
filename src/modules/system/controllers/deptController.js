const deptService = require('../services/deptService');
const { success, error } = require('../../../utils/response');
const { validateDept } = require('../dto/deptDto');

class DeptController {
  /**
   * 创建部门
   */
  async create(req, res) {
    try {
      const { error: validationError } = validateDept(req.body);
      if (validationError) {
        return res.status(400).json(error(validationError.details[0].message));
      }

      const dept = await deptService.create(req.body, req.user.username);
      res.json(success('部门创建成功', dept));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 更新部门
   */
  async update(req, res) {
    try {
      const { error: validationError } = validateDept(req.body, true);
      if (validationError) {
        return res.status(400).json(error(validationError.details[0].message));
      }

      const dept = await deptService.update(req.params.id, req.body, req.user.username);
      res.json(success('部门更新成功', dept));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 删除部门
   */
  async delete(req, res) {
    try {
      await deptService.delete(req.params.id);
      res.json(success('部门删除成功'));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取部门列表
   */
  async list(req, res) {
    try {
      const data = await deptService.findList(req.query);
      res.json(success('获取成功', data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取部门详情
   */
  async getInfo(req, res) {
    try {
      const dept = await deptService.findById(req.params.id);
      if (!dept) {
        return res.status(404).json(error('部门不存在'));
      }
      res.json(success('获取成功', dept));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 获取部门树结构
   */
  async treeselect(req, res) {
    try {
      const data = await deptService.getTree();
      res.json(success('获取成功', data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }

  /**
   * 更新部门状态
   */
  async updateStatus(req, res) {
    try {
      await deptService.updateStatus(
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

module.exports = new DeptController(); 