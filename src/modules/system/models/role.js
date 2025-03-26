const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelizeConfig');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roleName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '角色名称'
  },
  roleKey: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '角色权限字符串'
  },
  roleSort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '显示顺序'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态 0:禁用 1:启用'
  },
  remark: {
    type: DataTypes.STRING(500),
    comment: '备注'
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
  tableName: 'sys_role',
  timestamps: true,
  underscored: true,
  createdAt: 'createTime',
  updatedAt: 'updateTime'
});

module.exports = Role; 