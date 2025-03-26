const { Op } = require('sequelize');
const { User, Role, Menu, Dept } = require('../models');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * 创建用户
   */
  async create(userData, operator) {
    const { password, roleIds, ...userInfo } = userData;
    
    // 密码加密 所有用户的初始密码都是 123456（已使用 bcrypt 加密）
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      ...userInfo,
      password: hashedPassword,
      createBy: operator,
      updateBy: operator
    });

    // 关联角色
    if (roleIds && roleIds.length > 0) {
      await user.setRoles(roleIds);
    }

    return user;
  }

  /**
   * 更新用户
   */
  async update(id, userData, operator) {
    const { password, roleIds, ...userInfo } = userData;
    
    const updateData = {
      ...userInfo,
      updateBy: operator
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 更新用户信息
    await user.update(updateData);

    // 更新角色关联
    if (roleIds) {
      await user.setRoles(roleIds);
    }

    return user;
  }

  /**
   * 删除用户
   */
  async delete(ids) {
    return await User.destroy({
      where: {
        id: Array.isArray(ids) ? ids : [ids]
      }
    });
  }

  /**
   * 查询用户列表
   */
  async findList(query) {
    const { 
      pageNum = 1, 
      pageSize = 10, 
      username, 
      status, 
      mobile, 
      deptId 
    } = query;

    const where = {};
    
    if (username) {
      where.username = { [Op.like]: `%${username}%` };
    }
    if (status !== undefined) {
      where.status = status;
    }
    if (mobile) {
      where.mobile = { [Op.like]: `%${mobile}%` };
    }
    if (deptId) {
      where.deptId = deptId;
    }

    const { rows: list, count: total } = await User.findAndCountAll({
      where,
      include: [
        { 
          model: Role,
          through: { attributes: [] }
        },
        {
          model: Dept
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
   * 获取用户详情
   */
  async findById(id) {
    return await User.findByPk(id, {
      include: [
        { 
          model: Role,
          through: { attributes: [] }
        },
        {
          model: Dept
        }
      ]
    });
  }
  /**
   * 获取用户信息
   */
  async getUserInfo(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Role,
            through: { attributes: [] },
            include: [{
              model: Menu,
              through: { attributes: [] },
              where: { status: 1 },
              required: false
            }]
          },
          {
            model: Dept,
            attributes: ['deptName']
          }
        ]
      });

      if (!user) {
        this.no('用户不存在4');
      }

      // 获取权限列表
      const permissions = new Set();
      // 获取角色列表
      const roles = [];
      
      user.Roles.forEach(role => {
        if (role.status === 1) {
          roles.push(role.roleKey);
          role.Menus.forEach(menu => {
            if (menu.permission) {
              permissions.add(menu.permission);
            }
          });
        }
      });

      // 获取路由菜单
      const routes = await this.getUserMenus(userId);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            realName: user.realName,
            avatar: user.avatar,
            deptName: user.Dept?.deptName
          },
          roles,
          permissions: Array.from(permissions),
          routes
        }
      };
    } catch (err) {
      // console.error('Get user info error:', err);
      this.no(err);
    }
  }

  /**
   * 获取用户菜单列表
   */
  async getUserMenus(userId) {
    try {
      const menus = await Menu.findAll({
        attributes: [
          'id',
          'parentId',
          'menuName',
          'path',
          'component',
          'menuType',
          'visible',
          'status',
          'icon',
          'orderNum',
          'isFrame',
          'permission'
        ],
        include: [{
          model: Role,
          required: true,
          include: [{
            model: User,
            required: true,
            where: { id: userId }
          }]
        }],
        where: {
          status: 1,
          visible: 1,
          menuType: {
            [Op.in]: ['M', 'C']
          }
        },
        order: [
          ['orderNum', 'ASC']
        ]
      });

      // 构建路由数据
      const buildRoutes = (parentId) => {
        const routes = [];
        
        menus.forEach(item => {
          if (item.parentId === parentId) {
            const menu = item.toJSON();
            
            const route = {
              name: menu.path.substring(menu.path.lastIndexOf('/') + 1),
              path: menu.path,
              hidden: false,
              component: menu.component,
              meta: {
                title: menu.menuName,
                icon: menu.icon,
                noCache: false
              }
            };

            if (menu.isFrame === 1) {
              if (menu.menuType === 'M') {
                route.component = 'Layout';
              }
            } else {
              route.component = 'InnerLink';
              route.meta.link = menu.path;
            }

            const children = buildRoutes(menu.id);
            if (children.length > 0) {
              route.children = children;
            }

            routes.push(route);
          }
        });

        return routes;
      };

      return buildRoutes(0);
    } catch (err) {
      console.error('Get user menus error:', err);
      return [];
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(id, newPassword, operator) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    return await User.update(
      { 
        password: hashedPassword,
        updateBy: operator
      },
      { 
        where: { id } 
      }
    );
  }

  /**
   * 更新用户状态
   */
  async updateStatus(id, status, operator) {
    return await User.update(
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

module.exports = new UserService(); 