-- 初始化部门数据
INSERT INTO `sys_dept` (`id`, `parent_id`, `dept_name`, `order_num`, `leader`, `phone`, `email`, `status`, `create_by`) VALUES
(1, 0, '总公司', 1, 'admin', '15888888888', 'admin@example.com', 1, 'admin'),
(2, 1, '研发部门', 1, '张三', '15888888881', 'dev@example.com', 1, 'admin'),
(3, 1, '测试部门', 2, '李四', '15888888882', 'test@example.com', 1, 'admin'),
(4, 1, '运维部门', 3, '王五', '15888888883', 'ops@example.com', 1, 'admin'),
(5, 1, '市场部门', 4, '赵六', '15888888884', 'market@example.com', 1, 'admin'),
(6, 2, '前端组', 1, '小明', '15888888885', 'frontend@example.com', 1, 'admin'),
(7, 2, '后端组', 2, '小红', '15888888886', 'backend@example.com', 1, 'admin');

-- 初始化菜单数据
INSERT INTO `sys_menu` (`id`, `parent_id`, `menu_name`, `path`, `component`, `permission`, `menu_type`, `icon`, `order_num`, `status`, `visible`, `create_by`) VALUES
-- 一级菜单
(1, 0, '系统管理', 'system', NULL, NULL, 'M', 'system', 1, 1, 1, 'admin'),
(2, 0, '系统监控', 'monitor', NULL, NULL, 'M', 'monitor', 2, 1, 1, 'admin'),
-- 系统管理子菜单
(100, 1, '用户管理', 'user', 'system/user/index', 'system:user:list', 'C', 'user', 1, 1, 1, 'admin'),
(101, 1, '角色管理', 'role', 'system/role/index', 'system:role:list', 'C', 'role', 2, 1, 1, 'admin'),
(102, 1, '菜单管理', 'menu', 'system/menu/index', 'system:menu:list', 'C', 'menu', 3, 1, 1, 'admin'),
(103, 1, '部门管理', 'dept', 'system/dept/index', 'system:dept:list', 'C', 'dept', 4, 1, 1, 'admin'),
-- 用户管理按钮
(1001, 100, '用户查询', NULL, NULL, 'system:user:query', 'F', NULL, 1, 1, 1, 'admin'),
(1002, 100, '用户新增', NULL, NULL, 'system:user:add', 'F', NULL, 2, 1, 1, 'admin'),
(1003, 100, '用户修改', NULL, NULL, 'system:user:edit', 'F', NULL, 3, 1, 1, 'admin'),
(1004, 100, '用户删除', NULL, NULL, 'system:user:remove', 'F', NULL, 4, 1, 1, 'admin'),
(1005, 100, '用户导出', NULL, NULL, 'system:user:export', 'F', NULL, 5, 1, 1, 'admin'),
(1006, 100, '用户导入', NULL, NULL, 'system:user:import', 'F', NULL, 6, 1, 1, 'admin'),
(1007, 100, '重置密码', NULL, NULL, 'system:user:resetPwd', 'F', NULL, 7, 1, 1, 'admin'),
-- 角色管理按钮
(1008, 101, '角色查询', NULL, NULL, 'system:role:query', 'F', NULL, 1, 1, 1, 'admin'),
(1009, 101, '角色新增', NULL, NULL, 'system:role:add', 'F', NULL, 2, 1, 1, 'admin'),
(1010, 101, '角色修改', NULL, NULL, 'system:role:edit', 'F', NULL, 3, 1, 1, 'admin'),
(1011, 101, '角色删除', NULL, NULL, 'system:role:remove', 'F', NULL, 4, 1, 1, 'admin'),
(1012, 101, '角色导出', NULL, NULL, 'system:role:export', 'F', NULL, 5, 1, 1, 'admin'),
-- 菜单管理按钮
(1013, 102, '菜单查询', NULL, NULL, 'system:menu:query', 'F', NULL, 1, 1, 1, 'admin'),
(1014, 102, '菜单新增', NULL, NULL, 'system:menu:add', 'F', NULL, 2, 1, 1, 'admin'),
(1015, 102, '菜单修改', NULL, NULL, 'system:menu:edit', 'F', NULL, 3, 1, 1, 'admin'),
(1016, 102, '菜单删除', NULL, NULL, 'system:menu:remove', 'F', NULL, 4, 1, 1, 'admin'),
-- 部门管理按钮
(1017, 103, '部门查询', NULL, NULL, 'system:dept:query', 'F', NULL, 1, 1, 1, 'admin'),
(1018, 103, '部门新增', NULL, NULL, 'system:dept:add', 'F', NULL, 2, 1, 1, 'admin'),
(1019, 103, '部门修改', NULL, NULL, 'system:dept:edit', 'F', NULL, 3, 1, 1, 'admin'),
(1020, 103, '部门删除', NULL, NULL, 'system:dept:remove', 'F', NULL, 4, 1, 1, 'admin');

-- 初始化角色数据
INSERT INTO `sys_role` (`id`, `role_name`, `role_key`, `role_sort`, `status`, `remark`, `create_by`) VALUES
(1, '超级管理员', 'admin', 1, 1, '超级管理员', 'admin'),
(2, '普通角色', 'common', 2, 1, '普通角色', 'admin'),
(3, '开发人员', 'developer', 3, 1, '开发人员', 'admin'),
(4, '测试人员', 'tester', 4, 1, '测试人员', 'admin');

-- 初始化用户数据
INSERT INTO `sys_user` (`id`, `username`, `password`, `real_name`, `email`, `mobile`, `status`, `dept_id`, `remark`, `create_by`) VALUES
-- 使用 bcrypt 加密的密码，原始密码都是 123456
(1, 'admin', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '系统管理员', 'admin@example.com', '15888888888', 1, 1, '超级管理员', 'admin'),
(2, 'zhangsan', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '张三', 'zhangsan@example.com', '15888888881', 1, 2, '开发部门经理', 'admin'),
(3, 'lisi', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '李四', 'lisi@example.com', '15888888882', 1, 3, '测试部门经理', 'admin'),
(4, 'wangwu', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '王五', 'wangwu@example.com', '15888888883', 1, 4, '运维部门经理', 'admin');

-- 初始化用户角色关联关系
INSERT INTO `sys_user_role` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 3),
(3, 4),
(4, 2);

-- 初始化角色菜单关联关系
-- 超级管理员拥有所有权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`)
SELECT 1, id FROM sys_menu;

-- 普通角色拥有基本查询权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(2, 1),
(2, 100),
(2, 101),
(2, 102),
(2, 103),
(2, 1001),
(2, 1008),
(2, 1013),
(2, 1017);

-- 开发人员权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(3, 1),
(3, 100),
(3, 101),
(3, 102),
(3, 103),
(3, 1001),
(3, 1002),
(3, 1003),
(3, 1008),
(3, 1009),
(3, 1010),
(3, 1013),
(3, 1014),
(3, 1015),
(3, 1017),
(3, 1018),
(3, 1019);

-- 测试人员权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(4, 1),
(4, 100),
(4, 101),
(4, 102),
(4, 103),
(4, 1001),
(4, 1008),
(4, 1013),
(4, 1017);