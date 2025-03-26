const bcrypt = require('bcryptjs');
const { User, Role, Menu, Dept } = require('../models');
const { Op } = require('sequelize');
const BaseClass = require('../../baseClass');
const {success} = require('../../../utils/response')

class LoginService extends BaseClass {
  constructor() {
    super();
  }
  /**
   * 验证用户登录
   */
  async validateUser(username, password) {
    try {
      const user = await User.findOne({
        where: { username }
      });
      if (!user) {
        this.no('用户名或密码错误1');
      }

      if (user.status === 0) {
        this.no('用户已被禁用');
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        this.no('用户名或密码错误2');
      }
      return user;
      // return this.sendSuccess(res, user);
    } catch (err) {
      this.no(err);
    }
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
}

module.exports = new LoginService(); 