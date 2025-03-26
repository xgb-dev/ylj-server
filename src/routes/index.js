const express = require('express');
const router = express.Router();

// API 路由
router.use('/api', require('./api/index'));

// 页面路由
router.use('/', require('./pages/index'));

// 404 处理
router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = router;