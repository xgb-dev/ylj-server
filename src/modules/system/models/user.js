const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelizeConfig');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '密码'
  },
  realName: {
    type: DataTypes.STRING(50),
    comment: '真实姓名'
  },
  avatar: {
    type: DataTypes.STRING(200),
    comment: '头像地址'
  },
  email: {
    type: DataTypes.STRING(50),
    unique: true,
    comment: '邮箱'
  },
  mobile: {
    type: DataTypes.STRING(20),
    comment: '手机号'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态 0:禁用 1:启用'
  },
  deptId: {
    type: DataTypes.INTEGER,
    comment: '部门ID'
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
  tableName: 'sys_user',
  underscored: true,
  timestamps: true,
  createdAt: 'createTime',
  updatedAt: 'updateTime'
});

module.exports = User;
