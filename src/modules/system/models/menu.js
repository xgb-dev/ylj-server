const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelizeConfig');

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  parentId: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '父菜单ID'
  },
  menuName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '菜单名称'
  },
  path: {
    type: DataTypes.STRING(200),
    comment: '路由地址'
  },
  component: {
    type: DataTypes.STRING(200),
    comment: '组件路径'
  },
  permission: {
    type: DataTypes.STRING(100),
    comment: '权限标识'
  },
  menuType: {
    type: DataTypes.CHAR(1),
    defaultValue: 'M',
    comment: '菜单类型（M目录 C菜单 F按钮）'
  },
  icon: {
    type: DataTypes.STRING(100),
    comment: '菜单图标'
  },
  orderNum: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '显示顺序'
  },
  isFrame: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '是否为外链（0是 1否）'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态 0:禁用 1:启用'
  },
  visible: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '显示状态（0隐藏 1显示）'
  },
  createBy: {
    type: DataTypes.STRING(50),
    comment: '创建者'
  },
  updateBy: {
    type: DataTypes.STRING(50),
    comment: '更新者'
  }
}, {
  tableName: 'sys_menu',
  timestamps: true,
  underscored: true,
  createdAt: 'createTime',
  updatedAt: 'updateTime'
});

module.exports = Menu; 