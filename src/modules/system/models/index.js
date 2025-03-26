const User = require('./user');
const Role = require('./role');
const Dept = require('./dept');
const Menu = require('./menu');
const UserRole = require('./userRole');
const RoleMenu = require('./roleMenu');

// 用户与角色多对多关联
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'userId',
  otherKey: 'roleId'
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'roleId',
  otherKey: 'userId'
});

// 角色与菜单多对多关联
Role.belongsToMany(Menu, {
  through: RoleMenu,
  foreignKey: 'roleId',
  otherKey: 'menuId'
});
Menu.belongsToMany(Role, {
  through: RoleMenu,
  foreignKey: 'menuId',
  otherKey: 'roleId'
});

// 用户与部门一对多关联
Dept.hasMany(User, { foreignKey: 'deptId' });
User.belongsTo(Dept, { foreignKey: 'deptId' });

// 部门自关联
Dept.hasMany(Dept, { foreignKey: 'parentId', as: 'children' });
Dept.belongsTo(Dept, { foreignKey: 'parentId', as: 'parent' });

// 菜单自关联
Menu.hasMany(Menu, { foreignKey: 'parentId', as: 'children' });
Menu.belongsTo(Menu, { foreignKey: 'parentId', as: 'parent' });

module.exports = {
  User,
  Role,
  Dept,
  Menu,
  UserRole,
  RoleMenu
}; 