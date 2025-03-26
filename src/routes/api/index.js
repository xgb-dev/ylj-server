const express = require('express');
const router = express.Router();

// 导入所有路由
const indexRouter = require('./index2');
const billRouter = require('./bill');
const billsRouter = require('./bills');
const cdnRouter = require('./cdn');
const imgRouter = require('./img');
const themeRouter = require('./theme');
const getthemeRouter = require('./gettheme');
const photoRouter = require('./photo');
const wxappRouter = require('./wxappRoutes');
const systemRouter = require('./system');
const loginRouter = require('./login');

// 路由配置
const routes = [
  {
    path: '/',
    router: indexRouter,
    middleware: []  // 可以添加特定路由的中间件
  },
  {
    path: '/bill',
    router: billRouter,
    middleware: []
  },
  {
    path: '/bills',
    router: billsRouter,
    middleware: []
  },
  {
    path: '/cdn',
    router: cdnRouter,
    middleware: []
  },
  {
    path: '/img',
    router: imgRouter,
    middleware: []
  },
  {
    path: '/theme',
    router: themeRouter,
    middleware: []
  },
  {
    path: '/photo',
    router: photoRouter,
    middleware: []
  },
  {
    path: '/gettheme',
    router: getthemeRouter,
    middleware: []
  },
  {
    path: '/wxapp',
    router: wxappRouter,
    middleware: []
  },
  {
    path: '/system',
    router: systemRouter,
    middleware: []
  }
];
// 注册所有路由
routes.forEach(({ path, router: routerItem, middleware }) => {
  if (middleware && middleware.length > 0) {
    router.use(path, ...middleware, routerItem);
  } else {
    router.use(path, routerItem);
  }
});
// API 专用的错误处理
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    code: err.status || 500,
    success: false,
    message: err.message || 'Internal Server Error',
    data: null
  });
});

module.exports = router;