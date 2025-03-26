const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelizeConfig');

const Dept = sequelize.define('Dept', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  parentId: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '父部门id'
  },
  deptName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '部门名称'
  },
  orderNum: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '显示顺序'
  },
  leader: {
    type: DataTypes.STRING(50),
    comment: '负责人'
  },
  phone: {
    type: DataTypes.STRING(20),
    comment: '联系电话'
  },
  email: {
    type: DataTypes.STRING(50),
    comment: '邮箱'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态 0:禁用 1:启用'
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
  tableName: 'sys_dept',
  timestamps: true,
  underscored: true,
  createdAt: 'createTime',
  updatedAt: 'updateTime'
});

module.exports = Dept; 