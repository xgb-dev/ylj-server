const { Role, Menu } = require('../models');
const { Op } = require('sequelize');

class RoleService {
  /**
   * 创建角色
   */
  async create(roleData, operator) {
    const { menuIds, ...roleInfo } = roleData;
    
    const role = await Role.create({
      ...roleInfo,
      createBy: operator,
      updateBy: operator
    });

    // 关联菜单
    if (menuIds && menuIds.length > 0) {
      await role.setMenus(menuIds);
    }

    return role;
  }

  /**
   * 更新角色
   */
  async update(id, roleData, operator) {
    const { menuIds, ...roleInfo } = roleData;
    
    const role = await Role.findByPk(id);
    if (!role) {
      throw new Error('角色不存在');
    }

    // 更新角色信息
    await role.update({
      ...roleInfo,
      updateBy: operator
    });

    // 更新菜单关联
    if (menuIds) {
      await role.setMenus(menuIds);
    }

    return role;
  }

  /**
   * 删除角色
   */
  async delete(ids) {
    return await Role.destroy({
      where: {
        id: Array.isArray(ids) ? ids : [ids]
      }
    });
  }

  /**
   * 查询角色列表
   */
  async findList(query) {
    const { 
      pageNum = 1, 
      pageSize = 10, 
      roleName, 
      roleKey, 
      status 
    } = query;

    const where = {};
    
    if (roleName) {
      where.roleName = { [Op.like]: `%${roleName}%` };
    }
    if (roleKey) {
      where.roleKey = { [Op.like]: `%${roleKey}%` };
    }
    if (status !== undefined) {
      where.status = status;
    }

    const { rows: list, count: total } = await Role.findAndCountAll({
      where,
      include: [
        {
          model: Menu,
          through: { attributes: [] }
        }
      ],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      distinct: true
    });

    return {
      list,
      total,
      pageNum: parseInt(pageNum),
      pageSize: parseInt(pageSize)
    };
  }

  /**
   * 获取角色详情
   */
  async findById(id) {
    return await Role.findByPk(id, {
      include: [
        {
          model: Menu,
          through: { attributes: [] }
        }
      ]
    });
  }

  /**
   * 更新角色状态
   */
  async updateStatus(id, status, operator) {
    return await Role.update(
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

module.exports = new RoleService(); 