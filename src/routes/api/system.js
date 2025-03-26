const express = require('express');
const router = express.Router();
const userController = require('../../modules/system/controllers/userController');
const roleController = require('../../modules/system/controllers/roleController');
const deptController = require('../../modules/system/controllers/deptController');
const menuController = require('../../modules/system/controllers/menuController');

// 用户管理路由
router.post('/user', userController.create);
router.put('/user/:id', userController.update);
router.delete('/user/:ids', userController.delete);
router.get('/user/list', userController.list);
router.get('/user/:id', userController.getUserInfo);
router.put('/user/resetPwd/:id', userController.resetPassword);
router.put('/user/status/:id', userController.updateStatus);

// 角色管理路由
router.post('/role', roleController.create);
router.put('/role/:id', roleController.update);
router.delete('/role/:ids', roleController.delete);
router.get('/role/list', roleController.list);
router.get('/role/:id', roleController.getInfo);
router.put('/role/status/:id', roleController.updateStatus);

// 部门管理路由
router.post('/dept', deptController.create);
router.put('/dept/:id', deptController.update);
router.delete('/dept/:id', deptController.delete);
router.get('/dept/list', deptController.list);
router.get('/dept/:id', deptController.getInfo);
router.get('/dept/treeselect', deptController.treeselect);

// 菜单管理路由
router.post('/menu', menuController.create);
router.put('/menu/:id', menuController.update);
router.delete('/menu/:id', menuController.delete);
router.get('/menu/list', menuController.list);
router.get('/menu/:id', menuController.getInfo);
router.get('/menu/treeselect', menuController.treeselect);
router.get('/menu/roleMenuTreeselect/:roleId', menuController.roleMenuTreeselect);

// 获取用户菜单权限路由
router.get('/menu/getRouters', menuController.getUserMenus);

module.exports = router;