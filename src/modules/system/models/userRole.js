const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelizeConfig');

const UserRole = sequelize.define('UserRole', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'sys_user_role',
  timestamps: false,  
  underscored: true,
});

module.exports = UserRole; 