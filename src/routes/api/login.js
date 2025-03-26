const express = require('express');
const router = express.Router();
const loginController = require('../../modules/system/controllers/loginController');

// 用户登录
router.post('/login', loginController.login);
// 用户退出
router.post('/logout', loginController.logout);
// 获取用户信息
router.get('/getInfo', loginController.getInfo);

module.exports = router;
