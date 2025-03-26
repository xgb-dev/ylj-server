const express = require('express');
const router = express.Router();
const wxappController = require('../../modules/wxapp/controllers/getItemsController');

// 创建用户的路由
router.post('/getitems', wxappController.getByOpenId);

module.exports = router;