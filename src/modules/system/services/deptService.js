const { Dept, User } = require('../models');
const { Op } = require('sequelize');

class DeptService {
  /**
   * 创建部门
   */
  async create(deptData, operator) {
    return await Dept.create({
      ...deptData,
      createBy: operator,
      updateBy: operator
    });
  }

  /**
   * 更新部门
   */
  async update(id, deptData, operator) {
    const dept = await Dept.findByPk(id);
    if (!dept) {
      throw new Error('部门不存在');
    }

    return await dept.update({
      ...deptData,
      updateBy: operator
    });
  }

  /**
   * 删除部门
   */
  async delete(id) {
    // 检查是否存在子部门
    const childCount = await Dept.count({
      where: { parentId: id }
    });
    if (childCount > 0) {
      throw new Error('存在子部门,不允许删除');
    }

    // 检查是否存在用户
    const userCount = await User.count({
      where: { deptId: id }
    });
    if (userCount > 0) {
      throw new Error('部门存在用户,不允许删除');
    }

    return await Dept.destroy({
      where: { id }
    });
  }

  /**
   * 查询部门列表
   */
  async findList(query) {
    const { deptName, status } = query;

    const where = {};
    
    if (deptName) {
      where.deptName = { [Op.like]: `%${deptName}%` };
    }
    if (status !== undefined) {
      where.status = status;
    }

    return await Dept.findAll({
      where,
      order: [
        ['orderNum', 'ASC']
      ]
    });
  }

  /**
   * 获取部门详情
   */
  async findById(id) {
    return await Dept.findByPk(id);
  }

  /**
   * 获取部门树结构
   */
  async getTree() {
    const depts = await Dept.findAll({
      order: [
        ['orderNum', 'ASC']
      ]
    });

    const buildTree = (parentId) => {
      const tree = [];
      depts.forEach(dept => {
        if (dept.parentId === parentId) {
          const node = dept.toJSON();
          const children = buildTree(dept.id);
          if (children.length) {
            node.children = children;
          }
          tree.push(node);
        }
      });
      return tree;
    };

    return buildTree(0);
  }

  /**
   * 更新部门状态
   */
  async updateStatus(id, status, operator) {
    return await Dept.update(
      { 
        status,
        updateBy: operator
      },
      { 
        where: { id } 
      }
    );
  }
}

module.exports = new DeptService(); 