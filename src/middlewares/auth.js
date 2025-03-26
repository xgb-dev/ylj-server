

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'ZZLSL';

let auth = (req, res, next) => {
  let whitelist = ['', '404','/api/login', '/api/register','login','weixin', 'gettheme','gettheme/item', 'qiniuToken', 'cdn', 'img' , 'wxapp', 'worklist'];
  
  // Get the path without query parameters
  console.log(path)
  console.log(req.header('Authorization')?.replace('Bearer ', ''))
  const path = req.path || req.url.split('?')[0];

  // Check whitelist
  const done = whitelist.filter((regexp) => {
      return path.startsWith(`/${regexp}`)
  });
  
  if (done.length > 0) {
    next();
    return;
  }

  try {
    // 获取 token，按优先级检查不同位置
    const token = 
      req.header('Authorization')?.replace('Bearer ', '') || // Bearer token
      req.cookies.token ||
      req.headers.cookie?.split(';')
        .find(c => c.trim().startsWith('token='))
        ?.split('=')[1];

    if (!token) {
      return res.status(401).json({
        errcode: 1,
        msg: '未提供认证令牌',
        details: 'No token provided'
      });
    }

    // 验证 token
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            errcode: 2,
            msg: '登录已过期，请重新登录',
            details: 'Token expired'
          });
        }
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({
            errcode: 3,
            msg: '无效的认证令牌',
            details: 'Invalid token'
          });
        }
        return res.status(401).json({
          errcode: 4,
          msg: '认证失败',
          details: error.message
        });
      }

      // 将解码后的用户信息添加到请求对象中
      req.user = decoded;
      
      // 可选：检查 token 是否快要过期，如果是则刷新
      const tokenExp = decoded.exp * 1000; // 转换为毫秒
      const now = Date.now();
      const timeUntilExp = tokenExp - now;
      
      // 如果 token 将在 30 分钟内过期，刷新它
      if (timeUntilExp < 30 * 60 * 1000) {
        const newToken = jwt.sign(
          { ...decoded, iat: Math.floor(Date.now() / 1000) },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        res.setHeader('New-Token', newToken);
      }

      next();
    });
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(500).json({
      errcode: 5,
      msg: '服务器认证错误',
      details: '认证过程发生错误'
    });
  }
};
module.exports = auth;