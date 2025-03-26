const { Menu, Role } = require('../models');
const { Op } = require('sequelize');

class MenuService {
  /**
   * 创建菜单
   */
  async create(menuData, operator) {
    return await Menu.create({
      ...menuData,
      createBy: operator,
      updateBy: operator
    });
  }

  /**
   * 更新菜单
   */
  async update(id, menuData, operator) {
    const menu = await Menu.findByPk(id);
    if (!menu) {
      throw new Error('菜单不存在');
    }

    return await menu.update({
      ...menuData,
      updateBy: operator
    });
  }

  /**
   * 删除菜单
   */
  async delete(id) {
    // 检查是否存在子菜单
    const childCount = await Menu.count({
      where: { parentId: id }
    });
    if (childCount > 0) {
      throw new Error('存在子菜单,不允许删除');
    }

    return await Menu.destroy({
      where: { id }
    });
  }

  /**
   * 查询菜单列表
   */
  async findList(query) {
    const { menuName, status } = query;

    const where = {};
    
    if (menuName) {
      where.menuName = { [Op.like]: `%${menuName}%` };
    }
    if (status !== undefined) {
      where.status = status;
    }

    return await Menu.findAll({
      where,
      order: [
        ['orderNum', 'ASC']
      ]
    });
  }

  /**
   * 获取菜单详情
   */
  async findById(id) {
    return await Menu.findByPk(id);
  }

  /**
   * 获取菜单树结构
   */
  async getTree() {
    const menus = await Menu.findAll({
      order: [
        ['orderNum', 'ASC']
      ]
    });

    const buildTree = (parentId) => {
      const tree = [];
      menus.forEach(menu => {
        if (menu.parentId === parentId) {
          const node = menu.toJSON();
          const children = buildTree(menu.id);
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
   * 根据角色ID查询菜单树
   */
  async getRoleMenuTree(roleId) {
    const role = await Role.findByPk(roleId, {
      include: [
        {
          model: Menu,
          through: { attributes: [] }
        }
      ]
    });

    const menuIds = role ? role.Menus.map(m => m.id) : [];
    const menus = await this.getTree();

    return {
      menus,
      checkedKeys: menuIds
    };
  }

  /**
   * 获取用户菜单权限
   */
  async getUserMenus(userId) {
    const menus = await Menu.findAll({
      include: [
        {
          model: Role,
          required: true,
          include: [
            {
              model: User,
              required: true,
              where: { id: userId }
            }
          ]
        }
      ],
      order: [
        ['orderNum', 'ASC']
      ]
    });

    const buildTree = (parentId) => {
      const tree = [];
      menus.forEach(menu => {
        if (menu.parentId === parentId) {
          const node = menu.toJSON();
          const children = buildTree(menu.id);
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
}

module.exports = new MenuService(); 