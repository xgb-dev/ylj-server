const express = require('express');
const router = express.Router();

// 导入所有路由
const indexRouter = require('./home.js');
const loginRouter = require('./login');
const usersRouter = require('./users');
const worklistRouter = require('./worklist');

// 路由配置
const routes = [
  {
    path: '/',
    router: indexRouter,
    middleware: []  // 可以添加特定路由的中间件
  },
  {
    path: '/login',
    router: loginRouter,
    middleware: []
  },
  {
    path: '/worklist',
    router: worklistRouter,
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

module.exports = router;