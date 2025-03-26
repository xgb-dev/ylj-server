// 导入所需的Node.js模块
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var cors = require('cors');  // 添加 cors 依赖引入

// 引入路由配置文件
const routes = require('./routes/index');

// 引入认证中间件和错误处理中间件
const auth = require('./middlewares/auth');
const errorHandle = require('./middlewares/errorHandle');

// 创建Express应用实例
var app = express();

// 设置视图引擎配置
app.set('views', path.join(__dirname, '../views')); // 设置视图文件目录
app.set('view engine', 'ejs'); // 设置使用EJS模板引擎

// 输出当前环境变量
console.log(app.get('env'));

// 配置CORS跨域请求
app.use(cors({
    // 允许的源域名列表
    origin:['http://localhost:8080', 'https://www.youlaji.com', 'http://www.youlaji.com', 'http://localhost:3001', 'http://localhost:3006'],
    // origin:'*', // 允许所有域名（已注释）
    methods:['PUT','GET','POST','DELETE','OPTIONS'], // 允许的HTTP方法
    alloweHeaders:['Conten-Type', 'Authorization','request-origin',"Cookie",'Access-Control-Allow-Origin'] // 允许的请求头
}));

// 配置中间件
app.use(logger('dev')); // 日志记录
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: false })); // 解析URL编码的请求体
app.use(cookieParser()); // Cookie解析

// 配置Flash消息中间件
app.use(flash());

// 配置静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// 应用认证中间件，验证白名单和token
app.all('*', auth);

// 路由
app.use(routes);

// 配置错误处理中间件
app.use(errorHandle);

// 导出应用实例
module.exports = app;
