const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelizeConfig');

const RoleMenu = sequelize.define('RoleMenu', {
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  menuId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'sys_role_menu',
  timestamps: false,
  underscored: true,
});

module.exports = RoleMenu; 